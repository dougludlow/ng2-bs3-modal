import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { BsModalComponent, BsModalService } from '../../ng2-bs3-modal/ng2-bs3-modal';

@Component({
    moduleId: module.id,
    selector: 'modal-demo-component',
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

    constructor(private router: Router, private modalservice: BsModalService) { }

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

    dismissAll() {
        this.modalservice.dismissAll();
    }
}

export class Person {
    firstName: string;
    lastName: string;
}
