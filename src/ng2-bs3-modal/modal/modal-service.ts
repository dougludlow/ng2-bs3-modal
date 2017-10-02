import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';

import { BsModalComponent } from './modal';
import { BsModalHideType } from './models';
import { JQueryStyleEventEmitter } from 'rxjs/observable/FromEventObservable';

const EVENT_SUFFIX = 'ng2-bs3-modal';
const KEYUP_EVENT_NAME = `keyup.${EVENT_SUFFIX}`;
const CLICK_EVENT_NAME = `click.${EVENT_SUFFIX}`;
const SHOW_EVENT_NAME = `show.bs.modal.${EVENT_SUFFIX}`;

@Injectable()
export class BsModalService {

    private modals: BsModalComponent[] = [];
    private $body: JQuery;

    public onBackdropClose$: Observable<BsModalHideType>;
    public onKeyboardClose$: Observable<BsModalHideType>;
    public onModalStack$: Observable<Event>;

    constructor() {
        this.$body = jQuery(document.body);

        this.onBackdropClose$ = Observable.fromEvent(this.$body as JQueryStyleEventEmitter, CLICK_EVENT_NAME)
            .filter((e: MouseEvent) => jQuery(e.target).is('.modal'))
            .map(() => BsModalHideType.Backdrop)
            .share();

        this.onKeyboardClose$ = Observable.fromEvent(this.$body as JQueryStyleEventEmitter, KEYUP_EVENT_NAME)
            .filter((e: KeyboardEvent) => e.which === 27)
            .map(() => BsModalHideType.Keyboard)
            .share();

        this.onModalStack$ = Observable.fromEvent<Event>(this.$body as JQueryStyleEventEmitter, SHOW_EVENT_NAME)
            .do(() => {
                const zIndex = 1040 + (10 * $('.modal:visible').length);
                $(this).css('z-index', zIndex);
                setTimeout(function() {
                    $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
                }, 0);
            })
            .share();
    }

    public add(modal: BsModalComponent) {
        this.modals.push(modal);
    }

    public remove(modal: BsModalComponent) {
        const index = this.modals.indexOf(modal);
        if (index > -1) this.modals.splice(index, 1);
    }

    public focusNext() {
        const visible = this.modals.filter(m => m.visible);
        if (visible.length) {
            this.$body.addClass('modal-open');
            visible[visible.length - 1].focus();
        }
    }

    public dismissAll() {
        return Promise.all(this.modals.map((m) => {
            return m.dismiss();
        }));
    }
}
