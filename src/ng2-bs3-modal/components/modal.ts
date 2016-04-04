import { Component, AfterViewInit, OnDestroy, Input, Output, EventEmitter, Type, ElementRef } from 'angular2/core';
import { CanDeactivate, ComponentInstruction } from 'angular2/router';
import { ModalInstance, ModalResult } from './modal-instance';

@Component({
    selector: 'modal',
    template: `
        <div class="modal" [ngClass]="{ fade: animation }" tabindex="-1" role="dialog"
            [attr.data-keyboard]="keyboard" [attr.data-backdrop]="backdrop">
            <div class="modal-dialog" [ngClass]="{ 'modal-sm': isSmall(), 'modal-lg': isLarge() }">
                <div class="modal-content">
                    <ng-content></ng-content>
                </div>
            </div>
        </div>
    `
})
export class ModalComponent implements AfterViewInit, OnDestroy, CanDeactivate {

    instance: ModalInstance;
    overrideSize: string = null;
    visible: boolean = false;
    @Input() animation: boolean = true;
    @Input() backdrop: any = true;
    @Input() keyboard: boolean = true;
    @Input() size: string;
    @Output() onClose: EventEmitter<any> = new EventEmitter(false);
    @Output() onDismiss: EventEmitter<any> = new EventEmitter(false);
    @Output() onOpen: EventEmitter<any> = new EventEmitter(false);

    constructor(private element: ElementRef) {
    }

    ngAfterViewInit() {
        this.instance = new ModalInstance(this.element);
        this.instance.hidden.subscribe((result) => {
            this.visible = this.instance.visible;
            if (result === ModalResult.Dismiss)
                this.onDismiss.emit(undefined);
        });
        this.instance.shown.subscribe(() => {
            this.onOpen.emit(undefined);
        });
    }

    ngOnDestroy() {
        return this.instance && this.instance.destroy();
    }

    routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
        return this.ngOnDestroy();
    }

    open(size?: string): Promise<any> {
        if (ModalSize.validSize(size)) this.overrideSize = size;
        return this.instance.open().then(() => {
            this.visible = this.instance.visible;
        });
    }

    close(): Promise<any> {
        return this.instance.close().then(() => {
            this.onClose.emit(undefined);
        });
    }

    dismiss(): Promise<any> {
        return this.instance.dismiss().then(() => {
            // this.onDismiss.emit(undefined);
        });
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
