import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalComponent, BsModalService, BsModalHideType } from 'projects/ng2-bs3-modal/src';

@Component({
    selector: 'app-modal-demo',
    templateUrl: 'modal-demo.component.html',
    styles: [
        `.ng-valid[required] {
            border-left: 5px solid #5cb85c; /* green */
        }`,
        `.ng-invalid:not(.ng-untouched):not(form) {
            border-left: 5px solid #d9534f; /* red */
        }`,
        `.red-text {
            color: #d9534f !important; /* red */
        }`
    ],
    encapsulation: ViewEncapsulation.None
})
export class ModalDemoComponent {

    @ViewChild('modal')
    modal: BsModalComponent;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    model: Person = new Person();

    index = 0;
    backdropOptions = [true, false, 'static'];
    cssClass = '';

    animation = true;
    keyboard = true;
    backdrop: string | boolean = true;
    css = false;
    intercept = true;

    constructor(private router: Router, private modalservice: BsModalService) { }

    closed() {
        this.output = '(closed) ' + this.selected;
    }

    dismissed(type) {
        this.output = `(dismissed) ${BsModalHideType[type]}`;
    }

    opened() {
        this.output = '(opened)';
    }

    navigate() {
        this.router.navigateByUrl('/hello');
    }

    open() {
        this.modal.open();
    }

    dismissAll() {
        this.modalservice.dismissAll();
    }

    interceptDismiss(e) {
        if (this.intercept && e.type === BsModalHideType.Dismiss) {
            e.event.preventDefault();
            this.output = '(intercepted) Dismiss';
        }
    }

    interceptOpen(e) {
        if (this.intercept) {
            e.preventDefault();
            this.output = '(intercepted) Open';
        }
    }
}

export class Person {
    firstName: string;
    lastName: string;
}
