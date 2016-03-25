import { Component, ViewChild } from 'angular2/core';
import { Router } from 'angular2/router';
import { MODAL_DIRECTIVES, ModalComponent } from '../src/ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'modal-demo-component',
    templateUrl: 'demo/modal-demo.component.html',
    directives: [MODAL_DIRECTIVES]
})
export class ModalDemoComponent {

    @ViewChild('modal')
    modal: ModalComponent;
    items: string[] = ['item1', 'item2', 'item3'];
    modalSelected: string;
    selected: string;
    animationsEnabled: boolean = true;

    constructor(private router: Router) { }

    closed() {
        this.selected = '(closed) ' + this.modalSelected;
    }

    dismissed() {
        this.selected = '(dismissed)';
    }

    navigate() {
        this.router.navigateByUrl('/hello');
    }

    open() {
        this.modal.open();
    }
}