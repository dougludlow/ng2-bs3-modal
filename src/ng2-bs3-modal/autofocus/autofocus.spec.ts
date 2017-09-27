import { Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';

import { BsModalModule, BsModalComponent } from '../ng2-bs3-modal';
import { createRoot, advance } from '../../test/common';

describe('AutofocusDirective', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BsModalModule],
            declarations: [TestComponent, MissingModalComponent]
        });
    });

    afterEach(fakeAsync(() => {
        TestBed.resetTestingModule();
        tick(300); // backdrop transition
        tick(150); // modal transition
    }));

    it('should not throw an error if a modal isn\'t present', () => {
        const fixture = createRoot(MissingModalComponent);
    });

    it('should autofocus on element when modal is opened', fakeAsync(() => {
        const fixture = createRoot(TestComponent);
        fixture.componentInstance.open();
        tick();
        expect(<Element> document.getElementById('text')).toBe(document.activeElement);
    }));

    it('should autofocus on element when modal is opened with animations', fakeAsync(() => {
        const fixture = createRoot(TestComponent);
        fixture.componentInstance.animation = true;
        fixture.detectChanges();
        fixture.componentInstance.open();
        tick(150); // backdrop transition
        tick(300); // modal transition
        expect(<Element> document.getElementById('text')).toBe(document.activeElement);
    }));
});

@Component({
    selector: 'test-component',
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
    selector: 'missing-modal-component',
    template: `
        <input type="text" id="text1" autofocus />
    `
})
class MissingModalComponent {
}
