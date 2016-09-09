import { Component } from '@angular/core';

@Component({
    selector: 'hello-component',
    template: `
        <section class="container">
            <h1>Hello</h1>
            <p><a [routerLink]="['/']">Go back...</a></p>
        </section>
    `
})
export class HelloComponent { }