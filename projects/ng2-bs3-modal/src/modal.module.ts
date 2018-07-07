import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsModalService } from './modal/modal.service';
import { BsModalComponent } from './modal/modal.component';
import { BsModalHeaderComponent } from './modal/header.component';
import { BsModalBodyComponent } from './modal/body.component';
import { BsModalFooterComponent } from './modal/footer.component';
import { BsAutofocusDirective } from './autofocus/autofocus.directive';

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
export class BsModalModule { }
