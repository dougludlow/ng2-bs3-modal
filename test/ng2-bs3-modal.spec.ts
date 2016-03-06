import {
    beforeEach,
    beforeEachProviders,
    describe,
    expect,
    it,
    inject,
    injectAsync,
    setBaseTestProviders,
    TestComponentBuilder,
    ComponentFixture,
} from 'angular2/testing';
import {
    TEST_BROWSER_PLATFORM_PROVIDERS,
    TEST_BROWSER_APPLICATION_PROVIDERS
} from 'angular2/platform/testing/browser';
import { DynamicComponentLoader } from 'angular2/src/core/linker/dynamic_component_loader';
import { Component } from 'angular2/core';
import { ModalComponent, MODAL_DIRECTIVES } from '../src/ng2-bs3-modal/ng2-bs3-modal';

setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS);

describe('ModalComponent', () => {

    let modal: ModalComponent;

    beforeEach(() => {
        modal = new ModalComponent();
    });

    it('should instantiate', () => {
        expect(modal).toBeTruthy();
    });

    it('should render', injectAsync([TestComponentBuilder], (builder: TestComponentBuilder) => {
        return builder.createAsync(RootComponent).then((fixture: ComponentFixture) => {
            const element = fixture.nativeElement;
            expect(element.querySelectorAll('.modal').length).toBe(1);
        });
    }));

    it('should cleanup when destroyed', injectAsync([TestComponentBuilder], (builder: TestComponentBuilder) => {
        return builder.createAsync(RootComponent).then((fixture: ComponentFixture) => {
            console.log(fixture.nativeElement);
            fixture.destroy();
            expect(document.querySelectorAll('.modal').length).toBe(0);
        });
    }));
});

@Component({
    selector: 'root-component',
    directives: [MODAL_DIRECTIVES],
    template: `
        <button type="button" class="btn btn-default" (click)="modal.open()">Open me!</button>

        <modal #modal>
            <modal-header [show-close]="true">
                <h4 class="modal-title">I'm a modal!</h4>
            </modal-header>
            <modal-body>
                Hello World!
            </modal-body>
            <modal-footer [show-default-buttons]="true"></modal-footer>
        </modal>
    `
})
class RootComponent { }