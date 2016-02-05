# ng2-bs3-modal
Angular2 Bootstrap3 Modal Component

## Demo
http://dougludlow.github.io/ng2-bs3-modal/

## Install

    npm install ng2-bs3-modal

Then import and include in your component's directives:

    import { MODAL_DIRECTIVES } from 'ng2-bs3-modal';

    @Component({
        directives: [MODAL_DIRECTIVES]
    })

## Example

    <button type="button" class="btn btn-default" (click)="modal.open()">Open me!</button>
    
    <modal #modal>
        <modal-header [show-close]="true">
            <h4 class="modal-title">I'm a modal!</h4>
        </modal-header>
        <modal-body>
            Hello World!
        </modal-body>
        <modal-footer [show-default-buttons]="true"></modal-footer>
    </modal>

![Example](demo/images/modal.png)
