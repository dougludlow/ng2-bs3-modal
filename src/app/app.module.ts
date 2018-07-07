import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BsModalModule } from 'projects/ng2-bs3-modal/src';

import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { ModalDemoComponent } from './modal-demo.component';
import { HelloComponent } from './hello.component';

@NgModule({
    declarations: [
        AppComponent,
        ModalDemoComponent,
        HelloComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        BsModalModule,
        routing
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
