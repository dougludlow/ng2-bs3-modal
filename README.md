# ng2-bs3-modal
Angular2 Bootstrap3 Modal Component

## Demo
http://dougludlow.github.io/ng2-bs3-modal/

## Requirements

`ng2-bs3-modal` depends on bootstrap which depends on jquery, you'll need to include both scripts before ng2-bs3-modal:

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.js"></script>
  

Or, if you're using systemjs, configure it to load them. And import them in your typscript.

## Install

    npm install ng2-bs3-modal

Then import and include in your component's directives:

    import { MODAL_DIRECTIVES } from 'ng2-bs3-modal';

    @Component({
        directives: [MODAL_DIRECTIVES]
    })

## Examples

### Example: Default modal

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
    
### Example: Static modal
This will create a modal that cannot be closed with the escape key or by clicking outside of the modal.

    <button type="button" class="btn btn-default" (click)="modal.open()">Open me!</button>
    
    <modal #modal [keyboard]="false" [backdrop]="'static'">
        <modal-header [show-close]="false">
            <h4 class="modal-title">I'm a modal!</h4>
        </modal-header>
        <modal-body>
            Hello World!
        </modal-body>
        <modal-footer [show-default-buttons]="true"></modal-footer>
    </modal>
    
