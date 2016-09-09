import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalDemoComponent } from './modal-demo.component';
import { HelloComponent } from './hello.component';

const routes: Routes = [
    { path: '', component: ModalDemoComponent },
    { path: 'hello', component: HelloComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);