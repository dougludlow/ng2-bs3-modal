import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MODAL_DIRECTIVES, ModalComponent } from '../src/ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'modal-demo-component',
    templateUrl: 'demo/modal-demo.component.html',
    directives: [MODAL_DIRECTIVES],
    styles: [
        `.ng-valid[required] {
            border-left: 5px solid #5cb85c; /* green */
        }`,
        `.ng-invalid {
            border-left: 5px solid #d9534f; /* red */
        }`
    ]
})
export class ModalDemoComponent {

    @ViewChild('modal')
    modal: ModalComponent;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    model: Person = new Person();

    index: number = 0;
    backdropOptions = [true, false, 'static'];

    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;

    constructor(private router: Router) { }

    closed() {
        this.output = '(closed) ' + this.selected;
    }

    dismissed() {
        this.output = '(dismissed)';
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
}

export class Person {
    firstName: string;
    lastName: string;
}