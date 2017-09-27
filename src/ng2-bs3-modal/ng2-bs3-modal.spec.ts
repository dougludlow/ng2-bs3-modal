import { NgModule, Input, Component, ViewChild, Type, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { BsModalModule, BsModalComponent } from './ng2-bs3-modal';
import { createRoot, advance, ticks, removeModals } from '../test/common';

describe('ModalComponent', () => {

    let fixture: ComponentFixture<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TestModule,
                RouterTestingModule.withRoutes([
                    { path: '', component: TestComponent },
                    { path: 'test2', component: OtherTestComponent }
                ])
            ]
        });
    });

    afterEach(fakeAsync(() => {
        removeModals();
    }));

    it('should render', () => {
        fixture = createRoot(TestComponent);
        expect(document.querySelectorAll('.modal').length).toBe(1);
    });

    it('should cleanup when destroyed', fakeAsync(() => {
        fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        modal.ngOnDestroy();
        tick();
        expect(document.querySelectorAll('.modal').length).toBe(0);
    }));

    it('should emit onClose when modal is closed and animation is enabled', fakeAsync(() => {
        fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('onCloseAnimated');

        fixture.componentInstance.animate = true;
        fixture.detectChanges();
        modal.onClose.subscribe(spy);

        modal.open();
        ticks(150, 300); // backdrop, modal transitions
        modal.close();
        ticks(300, 150); // backdrop, modal transitions

        expect(spy).toHaveBeenCalled();
    }));

    it('should emit onClose when modal is closed and animation is disabled', fakeAsync(() => {
        fixture = createRoot(TestComponent);
        const modal:BsModalComponent = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('onClose');
        
        modal.onClose.subscribe(spy);
        modal.open();
        modal.close();
        tick();

        expect(spy).toHaveBeenCalled();
    }));

    it('should emit value passed to close when onClose emits', fakeAsync(() => {
        fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('onClose').and.callFake(x => x);
        const value = 'hello';

        modal.onClose.subscribe(spy);
        modal.open();
        tick();
        modal.close(value);
        tick();

        expect(spy.calls.first().returnValue).toBe(value);
    }));

    it('should emit onDismiss when modal is dimissed and animation is disabled', fakeAsync(() => {
        fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('');
        modal.onDismiss.subscribe(spy);
        modal.open();
        modal.dismiss();
        tick();
        expect(spy).toHaveBeenCalled();
    }));

    it('should emit onDismiss when modal is dismissed and animation is enabled', fakeAsync(() => {
        fixture = createRoot(TestComponent);
        const modal:BsModalComponent = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('onDismiss');

        fixture.componentInstance.animate = true;
        fixture.detectChanges();
        modal.ngAfterViewInit();
        modal.onDismiss.subscribe(spy);

        modal.open();
        modal.triggerTransitionEnd();
        ticks(150, 300); // backdrop, modal transitions
        modal.dismiss();
        ticks(300, 150); // backdrop, modal transitions

        expect(spy).toHaveBeenCalled();
    }));

    it('should emit onDismiss only once', fakeAsync(() => {
        fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('onDismiss').and.callFake(() => { });

        fixture.componentInstance.animate = true;
        fixture.detectChanges();
        modal.onDismiss.subscribe(spy);

        modal.open();
        modal.triggerTransitionEnd();
        ticks(150, 300); // backdrop, modal transitions
        modal.dismiss();
        ticks(300, 150); // backdrop, modal transitions

        expect(spy).toHaveBeenCalledTimes(1);
    }));

    it('should emit onDismiss only once when showDefaultButtons is false', fakeAsync(() => {
        fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('onDismiss');

        fixture.componentInstance.animate = true;
        fixture.componentInstance.defaultButtons = false;
        fixture.detectChanges();
        modal.onDismiss.subscribe(spy);

        modal.open();
        modal.triggerTransitionEnd();
        ticks(150, 300); // backdrop, modal transitions
        modal.dismiss();
        ticks(300, 150); // backdrop, modal transitions

        expect(spy).toHaveBeenCalledTimes(1);
    }));

    it('should emit onDismiss when modal is closed, opened, then dimissed from backdrop', fakeAsync(() => {
        fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('onDismiss');

        fixture.componentInstance.animate = true;
        fixture.detectChanges();
        modal.onDismiss.subscribe(spy);

        modal.open();
        modal.triggerTransitionEnd();
        ticks(150, 300); // backdrop, modal transitions
        modal.close();
        ticks(300, 150); // backdrop, modal transitions
        modal.open();
        modal.triggerTransitionEnd();
        ticks(150, 300); // backdrop, modal transitions
        (<HTMLElement>document.querySelector('.modal')).click();
        ticks(300, 150); // backdrop, modal transitions

        expect(spy).toHaveBeenCalled();
    }));

    it('should emit onDismiss when modal is dismissed a second time from backdrop', fakeAsync(() => {
        fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('onDismiss');

        fixture.componentInstance.animate = true;
        fixture.detectChanges();
        modal.onDismiss.subscribe(spy);

        modal.open();
        modal.triggerTransitionEnd();
        ticks(150, 300); // backdrop, modal transitions
        modal.dismiss();
        ticks(300, 150); // backdrop, modal transitions
        modal.open();
        modal.triggerTransitionEnd();
        ticks(150, 300); // backdrop, modal transitions
        (<HTMLElement>document.querySelector('.modal')).click();
        ticks(300, 150); // backdrop, modal transitions

        expect(spy).toHaveBeenCalledTimes(2);
    }));

    it('should emit onDismiss when modal is dismissed a second time from backdrop and showDefaultButtons is false', fakeAsync(() => {
        fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('onDismiss');

        fixture.componentInstance.animate = true;
        fixture.componentInstance.defaultButtons = false;
        fixture.detectChanges();
        modal.onDismiss.subscribe(spy);

        modal.open();
        modal.triggerTransitionEnd();
        ticks(150, 300); // backdrop, modal transitions
        modal.dismiss();
        ticks(300, 150); // backdrop, modal transitions
        modal.open();
        modal.triggerTransitionEnd();
        ticks(150, 300); // backdrop, modal transitions
        (<HTMLElement>document.querySelector('.modal')).click();
        ticks(300, 150); // backdrop, modal transitions

        expect(spy).toHaveBeenCalledTimes(2);
    }));

    it('should emit onOpen when modal is opened and animations have been enabled', fakeAsync(() => {
        fixture = createRoot(TestComponent);
        const modal = fixture.componentInstance.modal;
        const spy = jasmine.createSpy('onOpenAnimated');

        fixture.componentInstance.animate = true;
        fixture.detectChanges();
        modal.onOpen.subscribe(spy);

        modal.open();
        modal.triggerTransitionEnd();
        ticks(150, 300); // backdrop, modal transitions

        expect(spy).toHaveBeenCalled();
    }));

    describe('Routing', () => {
        it('should not throw an error when navigating on modal close',
            fakeAsync(inject([Router], (router: Router) => {
                // let zone = window['Zone']['ProxyZoneSpec'].assertPresent().getDelegate();
                fixture = createRoot<RootComponent>(RootComponent, router);
                const modal = fixture.componentInstance.glue.testComponent.modal;

                modal.onClose.subscribe(() => {
                    router.navigateByUrl('/test2');
                    advance(fixture);
                    const content = fixture.debugElement.nativeElement.querySelector('test-component2');
                    // expect(content).toHaveText('hello');
                });

                modal.open();
                advance(fixture, 150); // backdrop transition
                advance(fixture, 300); // modal transition

                modal.close();
                advance(fixture, 300); // modal transition
                advance(fixture, 150); // backdrop transition
            })));
    });
});

class GlueService {
    testComponent: TestComponent;
}

@Component({
    selector: 'test-component',
    template: `
        <button type="button" class="btn btn-default" (click)="modal.open()">Open me!</button>

        <bs-modal #modal [animation]="animate">
            <bs-modal-header [showDismiss]="true">
                <h4 class="modal-title">I'm a modal!</h4>
            </bs-modal-header>
            <bs-modal-body>
                Hello World!
            </bs-modal-body>
            <bs-modal-footer [showDefaultButtons]="defaultButtons"></bs-modal-footer>
        </bs-modal>
    `
})
class TestComponent {
    @ViewChild(BsModalComponent)
    modal: BsModalComponent;
    animate = false;
    defaultButtons = true;

    constructor(@Inject(GlueService) public glue: GlueService) {
        glue.testComponent = this;
    }
}

@Component({
    selector: 'test-component2',
    template: `{{message}}`,
})
class OtherTestComponent {
    message = 'hello';
}

@Component({
    selector: 'app-component',
    template: `
        <router-outlet></router-outlet>
    `
})
class RootComponent {
    constructor( @Inject(GlueService) public glue: GlueService) { }
}

@NgModule({
    imports: [RouterTestingModule, BsModalModule, CommonModule],
    providers: [GlueService],
    declarations: [TestComponent, OtherTestComponent, RootComponent],
    exports: [TestComponent, OtherTestComponent, RootComponent]
})
class TestModule { }
