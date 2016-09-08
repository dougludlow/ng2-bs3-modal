import { NgModule, Type } from '@angular/core';

import { ModalComponent } from './components/modal';
import { ModalHeaderComponent } from './components/modal-header';
import { ModalBodyComponent } from './components/modal-body';
import { ModalFooterComponent } from './components/modal-footer';
import { AutofocusDirective } from './directives/autofocus';

export * from './components/modal';
export * from './components/modal-header';
export * from './components/modal-body';
export * from './components/modal-footer';
export * from './components/modal-instance';

export const MODAL_DIRECTIVES: Type<any>[] = [
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    AutofocusDirective
];

@NgModule({
    declarations: MODAL_DIRECTIVES,
    exports: MODAL_DIRECTIVES
})
export class Ng2Bs3ModalModule { }
