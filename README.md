# ng2-bs3-modal
Angular2 Bootstrap3 Modal Component

## Example

    <button type="button" class="btn btn-default" (click)="modal.open()">Open me!</button>
    
    <modal [animation]="animationsEnabled" (onClose)="onClose($event)" #modal>
        <modal-header [show-close]="true">
            <h4 class="modal-title">I'm a modal!</h4>
        </modal-header>
        <modal-body>
            Hello World!
        </modal-body>
        <modal-footer [show-default-buttons]="true"></modal-footer>
    </modal>

![Example](demo/images/modal.png)
