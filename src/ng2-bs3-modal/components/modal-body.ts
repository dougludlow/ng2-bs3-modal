import { Component, Input, Output, EventEmitter, Type } from 'angular2/core';
import { ModalComponent } from './modal';

@Component({
    selector: 'modal-body',
    template: `
        <div class="modal-body">
            <ng-content></ng-content>
        </div>
    `
})
export class ModalBodyComponent {
    constructor(private modal: ModalComponent) { }
}