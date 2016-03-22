import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig } from 'angular2/router';
import { ModalDemoComponent } from './modal-demo.component';
import { HelloComponent } from './hello.component';

@Component({
    selector: 'modal-demo',
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/', name: 'ModalDemo', component: ModalDemoComponent },
    { path: '/hello', name: 'Hello', component: HelloComponent }
])
export class AppComponent { }
