import { Directive, ElementRef, OnInit } from 'angular2/core';
import { ModalComponent } from '../components/modal';

@Directive({
    selector: '[autofocus]'
})
export class AutofocusDirective implements OnInit {
    constructor(private el: ElementRef, private modal: ModalComponent) {
        this.modal.onOpen.subscribe(() => {
            this.el.nativeElement.focus();
        });
    }
}