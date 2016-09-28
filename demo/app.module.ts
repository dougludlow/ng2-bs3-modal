import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Ng2Bs3ModalModule } from '../src/ng2-bs3-modal/ng2-bs3-modal';
import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { ModalDemoComponent } from './modal-demo.component';
import { HelloComponent } from './hello.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        Ng2Bs3ModalModule
    ],
    declarations: [
        AppComponent,
        ModalDemoComponent,
        HelloComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}