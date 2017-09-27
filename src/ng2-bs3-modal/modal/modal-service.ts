import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { BsModalComponent } from './modal';
import { BsModalCloseSource } from './models';

const EVENT_SUFFIX = 'ng2-bs3-modal';
const KEYUP_EVENT_NAME = `keyup.${EVENT_SUFFIX}`;
const CLICK_EVENT_NAME = `click.${EVENT_SUFFIX}`;

@Injectable()
export class BsModalService {

    private modals: BsModalComponent[] = [];

    public onBackdropClose: Observable<BsModalCloseSource>;
    public onKeyboardClose: Observable<BsModalCloseSource>;

    constructor() {
        this.onBackdropClose = Observable.fromEvent(jQuery(document), CLICK_EVENT_NAME)
            .filter((e: MouseEvent) => e.target === jQuery('.modal')[0])
            .map(() => BsModalCloseSource.Backdrop)
            .share();

        this.onKeyboardClose = Observable.fromEvent(jQuery(document), KEYUP_EVENT_NAME)
            .filter((e: KeyboardEvent) => e.which === 27)
            .map(() => BsModalCloseSource.Keyboard)
            .share();

        jQuery(document).on('show.bs.modal', '.modal', function () {
            const zIndex = 1040 + (10 * $('.modal:visible').length);
            $(this).css('z-index', zIndex);
            setTimeout(function() {
                $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
            }, 0);
        });
    }

    public add(modal: BsModalComponent) {
        this.modals.push(modal);
    }

    public remove(modal: BsModalComponent) {
        const index = this.modals.indexOf(modal);
        if (index > -1) this.modals.splice(index, 1);
    }

    public dismissAll() {
        return Promise.all(this.modals.map((m) => {
            return m.dismiss();
        }));
    }
}
