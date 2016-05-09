import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Routes, Router } from '@angular/router';
import { ModalDemoComponent } from './modal-demo.component';
import { HelloComponent } from './hello.component';

@Component({
    selector: 'modal-demo',
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES]
})
@Routes([
    { path: '/', component: ModalDemoComponent },
    { path: '/hello', component: HelloComponent }
])
export class AppComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
        this.router.navigate(['/']);
    }
}
