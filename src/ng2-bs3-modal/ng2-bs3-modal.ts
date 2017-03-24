import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsModalService } from './modal/modal-service';
import { BsModalComponent } from './modal/modal';
import { BsModalHeaderComponent } from './modal/modal-header';
import { BsModalBodyComponent } from './modal/modal-body';
import { BsModalFooterComponent } from './modal/modal-footer';
import { BsAutofocusDirective } from './autofocus/autofocus';

export * from './modal/modal-service';
export * from './modal/modal';
export * from './modal/modal-header';
export * from './modal/modal-body';
export * from './modal/modal-footer';
export * from './modal/models';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        BsModalComponent,
        BsModalHeaderComponent,
        BsModalBodyComponent,
        BsModalFooterComponent,
        BsAutofocusDirective
    ],
    providers: [
        BsModalService
    ],
    exports: [
        BsModalComponent,
        BsModalHeaderComponent,
        BsModalBodyComponent,
        BsModalFooterComponent,
        BsAutofocusDirective
    ]
})
export class BsModalModule {
}
