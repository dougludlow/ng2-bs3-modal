import { Component, Input } from '@angular/core';
import { BsModalComponent } from './modal.component';

@Component({
    selector: 'bs-modal-footer',
    template: `
        <div class="modal-footer">
            <ng-content></ng-content>
            <button *ngIf="showDefaultButtons" type="button" class="btn btn-default" (click)="modal.dismiss()">
                {{dismissButtonLabel}}
            </button>
            <button *ngIf="showDefaultButtons" type="button" class="btn btn-primary" (click)="modal.close()">
                {{closeButtonLabel}}
              </button>
        </div>
    `
})
export class BsModalFooterComponent {
    @Input() showDefaultButtons = false;
    @Input() dismissButtonLabel = 'Dismiss';
    @Input() closeButtonLabel = 'Close';
    constructor(public modal: BsModalComponent) { }
}
