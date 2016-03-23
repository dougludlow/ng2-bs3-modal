import { Component } from 'angular2/core';
import { Router } from 'angular2/router';
import { MODAL_DIRECTIVES, ModalResult } from '../src/ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'modal-demo-component',
    templateUrl: 'demo/modal-demo.component.html',
    directives: [MODAL_DIRECTIVES]
})
export class ModalDemoComponent {
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

    navigate(result: ModalResult) {
        this.router.navigateByUrl('/hello');
    }
}