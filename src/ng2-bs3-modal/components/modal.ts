import { Component, AfterViewInit, OnDestroy, Input, Output, EventEmitter, Type } from 'angular2/core';

declare var jQuery: any;

@Component({
    selector: 'modal',
    template: `
        <div id="{{id}}" class="modal" [ngClass]="{ fade: animation }" tabindex="-1" role="dialog"
            [attr.data-keyboard]="keyboard" [attr.data-backdrop]="backdrop">
            <div class="modal-dialog" [ngClass]="{ 'modal-sm': isSmall(), 'modal-lg': isLarge() }">
                <div class="modal-content">
                    <ng-content></ng-content>
                </div>
            </div>
        </div>
    `
})
export class ModalComponent implements OnDestroy {

    id: string = uniqueId('modal_');
    $modal: any;
    result: ModalResult = ModalResult.None;
    hiding: boolean = false;
    overrideSize: string = null;
    @Input() animation: boolean = true;
    @Input() backdrop: string;
    @Input() keyboard: boolean;
    @Input() size: string;
    @Output() onClose: EventEmitter<string> = new EventEmitter();

    init() {
        this.$modal = jQuery('#' + this.id);
        this.$modal.appendTo('body').modal({show: false});
        this.$modal
            .off('hide.bs.modal.ng2-bs3-modal')
            .on('hide.bs.modal.ng2-bs3-modal', (e) => {
                this.hiding = true;
                if (this.result === ModalResult.None) this.dismiss();
                this.result = ModalResult.None;
            })
            .off('hidden.bs.modal.ng2-bs3-modal')
            .on('hidden.bs.modal.ng2-bs3-modal', (e) => {
                this.hiding = false;
                this.overrideSize = null;
            });
    }

    ngOnDestroy() {
        if(this.$modal) {
            this.$modal.data('bs.modal', null);
            this.$modal.remove();
        }
    }

    open(size?: string) {
        this.init();
        if (ModalSize.validSize(size)) this.overrideSize = size;
        this.$modal.modal('show');
    }

    close() {
        this.result = ModalResult.Close;
        this.onClose.next(this.result);
        this.hide();
    }

    dismiss() {
        this.result = ModalResult.Dismiss;
        this.onClose.next(this.result);
        this.hide();
    }

    private hide() {
        if (!this.hiding) this.$modal.modal('hide');
    }

    private isSmall() {
        return this.overrideSize !== ModalSize.Large && this.size === ModalSize.Small || this.overrideSize === ModalSize.Small;
    }

    private isLarge() {
        return this.overrideSize !== ModalSize.Small && this.size === ModalSize.Large || this.overrideSize === ModalSize.Large;
    }
}

export class ModalSize {
    static Small = 'sm';
    static Large = 'lg';

    static validSize(size: string) {
        return size && (size === ModalSize.Small || size === ModalSize.Large);
    }
}

export enum ModalResult {
    None,
    Close,
    Dismiss
}

let id: number = 0;
export function uniqueId(prefix: string): string {
    return prefix + ++id;
}
