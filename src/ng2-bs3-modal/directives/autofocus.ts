import { Directive, ElementRef } from 'angular2/core';
import { ModalComponent } from '../components/modal';

@Directive({
    selector: '[autofocus]'
})
export class AutofocusDirective {
    constructor(private el: ElementRef, private modal: ModalComponent) {
        this.modal.onOpen.subscribe(() => {
            this.el.nativeElement.focus();
        });
    }
}