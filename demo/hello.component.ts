import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';

@Component({
    selector: 'hello-component',
    directives: [ROUTER_DIRECTIVES],
    template: `
        <section class="container">
            <h1>Hello</h1>
            <p><a [routerLink]="['ModalDemo']">Go back...</a></p>
        </section>
    `
})
export class HelloComponent { }