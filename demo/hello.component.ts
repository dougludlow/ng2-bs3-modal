import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'hello-component',
    directives: [ROUTER_DIRECTIVES],
    template: `
        <section class="container">
            <h1>Hello</h1>
            <p><a [routerLink]="['/']">Go back...</a></p>
        </section>
    `
})
export class HelloComponent { }