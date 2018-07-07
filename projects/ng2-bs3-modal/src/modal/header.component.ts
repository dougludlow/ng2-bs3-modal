import { Component, Input } from '@angular/core';
import { BsModalComponent } from './modal.component';

@Component({
    selector: 'bs-modal-header',
    template: `
        <div class="modal-header">
            <button *ngIf="showDismiss" type="button" class="close" aria-label="Dismiss" (click)="modal.dismiss()">
                <span aria-hidden="true">&times;</span>
            </button>
            <ng-content></ng-content>
        </div>
    `
})
export class BsModalHeaderComponent {
    @Input() showDismiss = false;
    constructor(public modal: BsModalComponent) { }
}
