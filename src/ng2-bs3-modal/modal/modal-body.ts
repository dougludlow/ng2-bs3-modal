import { Component, Input, Output, EventEmitter, Type } from '@angular/core';
import { BsModalComponent } from './modal';

@Component({
    selector: 'bs-modal-body',
    template: `
        <div class="modal-body">
            <ng-content></ng-content>
        </div>
    `
})
export class BsModalBodyComponent {
}
