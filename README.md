# ng2-bs3-modal [![npm version](https://badge.fury.io/js/ng2-bs3-modal.svg)](http://badge.fury.io/js/ng2-bs3-modal) [![npm downloads](https://img.shields.io/npm/dm/ng2-bs3-modal.svg)](https://npmjs.org/ng2-bs3-modal) [![Build Status](https://travis-ci.org/dougludlow/ng2-bs3-modal.svg?branch=master)](https://travis-ci.org/dougludlow/ng2-bs3-modal)
Angular (2+) Bootstrap 3 Modal Component

## Demo
http://dougludlow.github.io/ng2-bs3-modal/demo/

## Prerequisites

If you're using Typescript in your project, `ng2-bs3-modal` requires Typescript v2.0.0 or greater. Also make sure that your editor (Visual Studio Code, Atom, Webstorm, etc.) supports Typescript >= v2.0.0 or you'll see errors even though it compiles.

## Dependencies

`ng2-bs3-modal` depends on `bootstrap` which depends on `jquery`, you'll need to include both scripts before `ng2-bs3-modal` or somehow make them available globally, depending on your build system.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.js"></script>
```

## Install

npm
```bash
npm install --save ng2-bs3-modal
```

yarn
```bash
yarn add ng2-bs3-modal
```

Then include the `ng2-bs3-modal` in your project.

Using [SystemJS](https://github.com/systemjs/systemjs), you can add a mapping to your `System.config`:

```javascript
System.config({
    defaultJSExtensions: true,
    map: {
        'ng2-bs3-modal': 'node_modules/ng2-bs3-modal'
    }
});
```

Or you can include a reference to the bundle in your html:

```html
<script src="node_modules/ng2-bs3-modal/bundles/ng2-bs3-modal.system.js"></script>
```

Then include the module in the `imports` collection of your app's module:

```typescript
import { NgModule } from '@angular/core';
import { BsModalModule } from 'ng2-bs3-modal';

@NgModule({
    imports: [ BsModalModule ]
    ...
})
export class MyAppModule { }
```

## Example Projects

The following is a list of basic demo projects that use the `ng2-bs3-modal`:

- [npm](https://github.com/dougludlow/ng2-bs3-modal-demo-npm)
- [SystemJS](https://github.com/dougludlow/ng2-bs3-modal-demo-systemjs)
- [jspm](https://github.com/dougludlow/ng2-bs3-modal-demo-jspm)
- [angular-cli](https://github.com/dougludlow/ng2-bs3-modal-demo-angular-cli)
- [webpack](https://github.com/dougludlow/ng2-bs3-modal-demo-webpack)

Feel free to request more.

## API

### BsModalComponent

#### Inputs

- `animation: boolean`, default: `true`

   Specify `false` to simply show the modal rather than having it fade in/out of view.
   
- `backdrop: string | boolean`, default: `true`

   Specify `'static'` for a backdrop which doesn't close the modal on click or `false` for no backdrop.
   
- `keyboard: boolean`, default: `true`

   Closes the modal when escape key is pressed. Specify `false` to disable.
   
- `size: string`, default: `undefined`

   Specify `'sm'` for small and `'lg'` for large.

- `cssClass: string`, default: `undefined`

   Applies the given class to the modal. Can be used to styles the modal; for example, giving it a custom size.

#### Outputs

- `onShow: EventEmitter<Event>`

   Emits when the `show.bs.modal` event is triggered, just before the modal is shown. Call `Event.preventDefault()` to cancel the modal from showing.

- `onHide: EventEmitter<BsModalHideEvent>`

   Emits when the `hide.bs.modal` event is triggered, just before the modal is hidden. Call `BsModalHideEvent.event.preventDefault()` to cancel the modal from hiding.

- `onClose: EventEmitter<any>`

   Emits when `ModalComponent.close()` is called. Will emit whatever was passed into `ModalComponent.close()`.

- `onDismiss: EventEmitter<BsModalHideType>`
    
   Emits when `ModalComponent.dismiss()` is called, or when the modal is dismissed with the keyboard or backdrop. Returns a `BsModalHideType` that can be used to determine how the modal was dismissed.

- `onOpen: EventEmitter`
    
   Emits when `ModalComponent.open()` is called.

#### Methods

- `open(size?: string): Promise`

   Opens the modal. Size is optional. Specify `'sm'` for small and `'lg'` for large to override size. Returns a promise that resolves when the modal is completely shown.
   
- `close(value?: any): Promise<any>`

   Closes the modal. Causes `onClose` to be emitted. Returns a promise that resolves the value passed to `close` when the modal is completely hidden.

- `dismiss(): Promise`

   Dismisses the modal. Causes `onDismiss` to be emitted. Returns a promise that resolves when the modal is completely hidden.

### BsModalHeaderComponent

#### Inputs

- `showDismiss: boolean`, default: `false`

   Show or hide the close button in the header. Specify `true` to show.
   
### BsModalFooterComponent

#### Inputs

- `showDefaultButtons: boolean`, default: `false`

   Show or hide the default 'Close' and 'Dismiss' buttons in the footer. Specify `true` to show.

- `closeButtonLabel: string`, default: `'Close'`

   Change the label in the default 'Close' button in the footer. Has no effect if showDefaultButtons aren't set.

- `dismissButtonLabel: string`, default: `'Dismiss'`

   Change the label in the default 'Dismiss' button in the footer. Has no effect if showDefaultButtons aren't set.

### BsModalService

#### Methods

- `dismissAll(): void`
   
   Dismiss all open modals. Inject the `BsModalService` into a componet/service to use.

## Example Usage

### Default modal

```html
<button type="button" class="btn btn-default" (click)="modal.open()">Open me!</button>

<bs-modal #modal>
    <bs-modal-header [showDismiss]="true">
        <h4 class="modal-title">I'm a modal!</h4>
    </bs-modal-header>
    <bs-modal-body>
        Hello World!
    </bs-modal-body>
    <bs-modal-footer [showDefaultButtons]="true"></bs-modal-footer>
</bs-modal>
```
    
![Example](src/demo/assets/modal.png)
    
### Static modal

This will create a modal that cannot be closed with the escape key or by clicking outside of the modal.

```html
<bs-modal #modal [keyboard]="false" [backdrop]="'static'">
    <bs-modal-header [showDismiss]="false">
        <h4 class="modal-title">I'm a modal!</h4>
    </bs-modal-header>
    <bs-modal-body>
        Hello World!
    </bs-modal-body>
    <bs-modal-footer [showDefaultButtons]="true"></bs-modal-footer>
</bs-modal>
```
    
### Use custom buttons in footer

```html    
<bs-modal #modal>
    <bs-modal-header>
        <h4 class="modal-title">I'm a modal!</h4>
    </bs-modal-header>
    <bs-modal-body>
        Hello World!
    </bs-modal-body>
    <bs-modal-footer>
        <button type="button" class="btn btn-default" data-dismiss="modal" (click)="modal.dismiss()">Cancel</button>
        <button type="button" class="btn btn-primary" (click)="modal.close()">Ok</button>
    </bs-modal-footer>
</bs-modal>
```
    
![Example](src/demo/assets/modal-custom-footer.png)
    
### Opening and closing the modal from a parent component

```typescript
import { Component, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
    selector: 'parent-component',
    template: `
        <bs-modal #myModal>
            ...
        </bs-modal>
    `
})
export class ParentComponent {
    @ViewChild('myModal')
    modal: BsModalComponent;

    close() {
        this.modal.close();
    }
    
    open() {
        this.modal.open();
    }
}
```

### Opening the modal when the parent component loads

```typescript
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
    selector: 'parent-component',
    template: `
        <bs-modal #myModal>
            ...
        </bs-modal>
    `
})
export class ParentComponent implements AfterViewInit {
    @ViewChild('myModal')
    modal: BsModalComponent;

    ngAfterViewInit() {
        this.modal.open();
    }
}
```

Note: `ViewChild` doesn't resolve the `modal` property until `AfterViewInit`. `OnInit` is too early and will result in an "undefined" error.

### Multiple modals in a component

```typescript
import { Component, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
    selector: 'parent-component',
    template: `
        <bs-modal #myFirstModal>
            ...
        </bs-modal>
        <bs-modal #mySecondModal>
            ...
        </bs-modal>
    `
})
export class ParentComponent {
    @ViewChild('myFirstModal')
    modal1: BsModalComponent;
    
    @ViewChild('mySecondModal')
    modal2: BsModalComponent;
    
    ...
}
```

### Modal with a custom size

```typescript
import { Component, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
    selector: 'parent-component',
    styles: ['>>> .modal-xl { width: 1100px; }'],
    template: `
        <bs-modal cssClass="modal-xl" #modal>
            ...
        </bs-modal>
    `
})
export class ParentComponent {
    ...
}
```

Note: Angular2 emulates the shadow dom by prefixing component styles with a unique identifier. Because the modal is attached to the body tag, it doesn't pick up these styles. You will need to add the `/deep/` or `>>>` selector in order for the style to take effect. See [Component Styles](https://angular.io/docs/ts/latest/guide/component-styles.html#!#-deep-).

### Modal in NgFor

```typescript
import { Component, ViewChildren } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
    selector: 'parent-component',
    template: `
        <button type="button" class="btn btn-default" (click)="modal.open()">Open me!</button>
        <div *ngFor="let item in items; trackBy: item.id">
            <bs-modal #modal>
                ...
            </bs-modal>
        </div>
    `
})
export class ParentComponent {
    @ViewChildren(BsModalComponent)
    modals: QueryList<BsModalComponent>; // How to access a collection of modals
    ...
}
```

Note: If you are updating items asynchronously, make sure you are using `trackBy` in the `ngFor` directive so that Angular doesn't teardown and redraw the elements each time the collection is changed. See [NgFor Directive](https://angular.io/docs/ts/latest/api/common/index/NgFor-directive.html) for more details.

### Modal with validation

```html
<bs-modal #validationModal>
    <form #modalForm="ngForm">
        <bs-modal-header [showDismiss]="true">
            <h4 class="modal-title">I'm a modal!</h4>
        </bs-modal-header>
        <bs-modal-body>
            <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" class="form-control" required [(ngModel)]="firstName" name="firstName" id="firstName">
            </div>
            <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" class="form-control" required [(ngModel)]="lastName" name="lastName" id="lastName">
            </div>
        </bs-modal-body>
        <bs-modal-footer>
            <button type="button" class="btn btn-default" data-dismiss="modal" (click)="validationModal.dismiss()">Cancel</button>
            <button type="button" class="btn btn-primary" [disabled]="!modalForm.valid" (click)="validationModal.close()">Save</button>
        </bs-modal-footer>
    </form>
</bs-modal>
```

### Autofocus on a textbox when modal is opened

```html    
<bs-modal #modal>
    <bs-modal-header>
        <h4 class="modal-title">I'm a modal!</h4>
    </bs-modal-header>
    <bs-modal-body>
        <div class="form-group">
            <label for="textbox">I'm a textbox!</label>
            <input autofocus type="text" class="form-control" id="textbox">
        </div>        
    </bs-modal-body>
    <bs-modal-footer [showDefaultButtons]="true"></bs-modal-footer>
</bs-modal>
```

## Building

```bash
git clone https://github.com/dougludlow/ng2-bs3-modal.git
yarn
yarn build
```

## Running 

```bash
yarn start
```

Navigate to http://localhost:4200/ in your browser.

## Testing

```bash
yarn test
```

To run tests once without watching:
```bash
yarn test:single
```

## Bugs/Contributions

Report all bugs and feature requests on the [issue tracker](https://github.com/dougludlow/ng2-bs3-modal/issues).

Contributions are welcome! Feel free to open a [pull request](https://github.com/dougludlow/ng2-bs3-modal/pulls). 
