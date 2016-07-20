import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';

@Component({
    selector: 'modal-demo',
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES]
})
export class AppComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.router.navigate(['/']);
    }
}
