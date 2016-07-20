import { provideRouter, RouterConfig } from '@angular/router';

import { ModalDemoComponent } from './modal-demo.component';
import { HelloComponent } from './hello.component';

const routes: RouterConfig = [
    {path: '', component: ModalDemoComponent},
    {path: 'hello', component: HelloComponent}
];

export const appRouterProviders = [
    provideRouter(routes)
];