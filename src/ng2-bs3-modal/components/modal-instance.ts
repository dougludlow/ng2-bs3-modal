import { ElementRef } from 'angular2/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/toPromise';

declare var jQuery: any;

export class ModalInstance {

    private suffix: string = 'ng2-bs3-modal';
    private shownEventName: string = 'shown.bs.modal';
    private hiddenEventName: string = 'hidden.bs.modal';

    $modal: any;
    shown: Observable<any>;
    shownSubscriber: Subscriber<any>;
    hidden: Observable<ModalResult>;
    hiddenSubscriber: Subscriber<ModalResult>;
    result: ModalResult;
    visible: boolean = false;

    constructor(private element: ElementRef) {
        this.init();
    }

    open(): Promise<any> {
        this.create();
        return this.show();
    }

    close(): Promise<any> {
        this.result = ModalResult.Close;
        return this.hide();
    }

    dismiss(): Promise<any> {
        this.result = ModalResult.Dismiss;
        return this.hide();
    }

    destroy(): Promise<any> {
        return this.hide().then(() => {
            this.$modal.data('bs.modal', null);
            this.$modal.remove();
        });
    }

    private show() {
        this.$modal.appendTo('body');
        this.$modal.modal('show');
        return this.shown.toPromise();
    }

    private hide(): Promise<ModalResult> {
        if (this.$modal) this.$modal.modal('hide');
        return this.hidden.toPromise();
    }

    private init() {
        this.shown = new Observable<any>((subscriber: Subscriber<any>) => {
            this.shownSubscriber = subscriber;
        });

        this.hidden = new Observable<ModalResult>((subscriber: Subscriber<ModalResult>) => {
            this.hiddenSubscriber = subscriber;
        });
    }

    private create() {
        if (!this.$modal) {
            this.$modal = jQuery(this.element.nativeElement.firstElementChild);
            this.$modal.appendTo('body').modal({ show: false });
        }

        this.$modal
            .off(`${this.shownEventName}.${this.suffix}`)
            .on(`${this.shownEventName}.${this.suffix}`, () => {
                this.visible = true;
                this.shownSubscriber.next();
                this.shownSubscriber.complete();
            })
            .off(`${this.hiddenEventName}.${this.suffix}`)
            .on(`${this.hiddenEventName}.${this.suffix}`, () => {
                this.visible = false;
                if (this.result === ModalResult.None) {
                    this.result = ModalResult.Dismiss;
                };
                this.hiddenSubscriber.next(this.result);
                this.hiddenSubscriber.complete();
            });
    }
}

export enum ModalResult {
    None,
    Close,
    Dismiss
}