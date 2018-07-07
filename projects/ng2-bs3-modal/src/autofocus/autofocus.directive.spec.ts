import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';

import { BsModalModule } from '../modal.module';
import { BsModalComponent } from '../modal/modal.component';
import { createRoot, removeModals } from '../../test/common';

describe('AutofocusDirective', () => {

    let fixture: ComponentFixture<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BsModalModule],
            declarations: [TestComponent, MissingModalComponent]
        });
    });

    afterEach(fakeAsync(() => {
        removeModals();
    }));

    it('should not throw an error if a modal isn\'t present', () => {
        fixture = createRoot(MissingModalComponent);
    });

    it('should autofocus on element when modal is opened', fakeAsync(() => {
        fixture = createRoot(TestComponent);
        fixture.componentInstance.open();
        tick();
        const element: Element = document.getElementById('text');
        expect(element).toBe(document.activeElement);
    }));

    it('should autofocus on element when modal is opened with animations', fakeAsync(() => {
        fixture = createRoot(TestComponent);
        fixture.componentInstance.animation = true;
        fixture.detectChanges();
        fixture.componentInstance.open();
        tick(150); // backdrop transition
        tick(300); // modal transition
        const element: Element = document.getElementById('text');
        expect(element).toBe(document.activeElement);
    }));
});

@Component({
    selector: 'bs-test-component',
    template: `
        <bs-modal #modal [animation]="animation">
            <bs-modal-header [showDismiss]="true">
                <h4 class="modal-title">I'm a modal!</h4>
            </bs-modal-header>
            <bs-modal-body>
                <input type="text" id="text" autofocus />
            </bs-modal-body>
            <bs-modal-footer [showDefaultButtons]="true"></bs-modal-footer>
        </bs-modal>
    `
})
class TestComponent {
    @ViewChild(BsModalComponent)
    modal: BsModalComponent;
    animation = false;

    open() {
        return this.modal.open();
    }
}

@Component({
    selector: 'bs-missing-modal-component',
    template: `
        <input type="text" id="text1" autofocus />
    `
})
class MissingModalComponent {
}
