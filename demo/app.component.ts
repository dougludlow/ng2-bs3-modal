import { Component } from 'angular2/core';
import { MODAL_DIRECTIVES, ModalResult } from '../src/ng2-bs3-modal';

@Component({
    selector: 'modal-demo',
    templateUrl: 'demo/app.component.html',
    directives: [MODAL_DIRECTIVES]
})
export class AppComponent {
    items: string[] = ['item1', 'item2', 'item3'];
    modalSelected: string;
    selected: string;
    animationsEnabled: boolean = true;

    onClose(result: ModalResult) {
        if (result === ModalResult.Close) {
            this.selected = this.modalSelected;
        }
    }
}