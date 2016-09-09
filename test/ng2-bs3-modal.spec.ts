import { NgModule, Input, Component, ViewChild, Type, Inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, inject, tick, flushMicrotasks, discardPeriodicTasks } from '@angular/core/testing';
import { Router, RouterOutletMap, DefaultUrlSerializer, UrlSerializer, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Ng2Bs3ModalModule, ModalComponent } from '../src/ng2-bs3-modal/ng2-bs3-modal';


describe('Smoke test', () => {
    it('should run a passing test', () => {
        expect(true).toEqual(true, 'should pass');
    });
});

describe('ModalComponent', () => {

    beforeEach(function () {
        jasmine.addMatchers(window['jasmine-jquery-matchers']);
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TestModule,
                RouterTestingModule.withRoutes([
                    { path: '', component: TestComponent },
                    { path: 'test2', component: TestComponent2 }
                ])
            ]
        });
    });

    it('should instantiate component', () => {
        let fixture = TestBed.createComponent(TestComponent);
        expect(fixture.componentInstance instanceof TestComponent).toBe(true, 'should create AppComponent');
        fixture.destroy();
    });

    it('should render', () => {
        const fixture = createRoot(TestComponent);
        expect(document.querySelectorAll('.modal').length).toBe(1);
        fixture.destroy();
    });

    it('should cleanup when destroyed', done => {
        const modal = createRoot(TestComponent).componentInstance.modal;
        modal.ngOnDestroy();
        setTimeout(() => {
            expect(document.querySelectorAll('.modal').length).toBe(0);
            done();
        }, 1000);
    });

    it('should emit onClose when modal is closed', done => {
        const modal = createRoot(TestComponent).componentInstance.modal;
        modal.onClose.subscribe(() => { done(); });
        modal.open().then(() => { modal.close(); });
    });

    it('should emit onClose when modal is closed and animation is disabled', done => {
        const fixture = createRoot(TestComponent);
        fixture.componentInstance.animate = false;
        fixture.detectChanges();
        fixture.componentInstance.modal.onClose.subscribe(() => {
            done();
        });
        fixture.componentInstance.modal.open()
            .then(() => { fixture.componentInstance.modal.close(); });
    });

    it('should emit onDismiss when modal is dimissed', done => {
        const modal = createRoot(TestComponent).componentInstance.modal;
        modal.onDismiss.subscribe(() => { done(); });
        modal.open().then(() => { modal.dismiss(); });
    });

    it('should emit onDismiss only once', done => {
        const modal = createRoot(TestComponent).componentInstance.modal;
        let times = 0;

        setTimeout(() => {
            expect(times).toBe(1);
            done();
        }, 1000);

        modal.onDismiss.subscribe(() => { times++; });
        modal.open().then(() => { modal.dismiss(); });
    });

    it('should emit onDismiss when modal is dismissed and animation is disabled', done => {
        const fixture = createRoot(TestComponent);
        fixture.componentInstance.animate = false;
        fixture.detectChanges();
        fixture.componentInstance.modal.onDismiss.subscribe(() => {
            done();
        });
        fixture.componentInstance.modal.open()
            .then(() => { fixture.componentInstance.modal.dismiss(); });
    });

    it('should emit onDismiss when modal is dismissed a second time from backdrop', done => {
        const modal = createRoot(TestComponent).componentInstance.modal;
        let times = 0;

        modal.onDismiss.subscribe(() => {
            times++;
            if (times === 2) done();
        });
        modal.open()
            .then(() => { modal.dismiss(); })
            .then(() => { modal.open(); })
            .then(() => { (<HTMLElement>document.querySelector('.modal')).click(); });
    });

    it('should emit onDismiss when modal is closed, opened, then dimissed from backdrop', done => {
        const modal = createRoot(TestComponent).componentInstance.modal;
        modal.onDismiss.subscribe(() => {
            done();
        });
        modal.open()
            .then(() => { modal.close(); })
            .then(() => { modal.open(); })
            .then(() => { (<HTMLElement>document.querySelector('.modal')).click(); });

    });

    it('should emit onOpen when modal is opened', done => {
        const modal = createRoot(TestComponent).componentInstance.modal;
        modal.onOpen.subscribe(() => { done(); });
        modal.open();
    });

    describe('Routing', () => {
        it('should not throw an error when navigating on modal close',
            fakeAsync(inject([Router], (router: Router) => {
                // let zone = window['Zone']['ProxyZoneSpec'].assertPresent().getDelegate();
                const fixture = createRoot(RootComponent, router);
                const modal = fixture.componentInstance.glue.testComponent.modal;

                modal.onClose.subscribe(() => {
                    router.navigateByUrl('/test2');
                    advance(fixture);
                    let content = fixture.debugElement.nativeElement.querySelector('test-component2');
                    expect(content).toHaveText('hello');
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

function advance(fixture: ComponentFixture<any>, millis?: number): void {
    tick(millis);
    fixture.detectChanges();
}

function createRoot<T>(type: Type<T>, router?: Router): ComponentFixture<T> {
    const f = TestBed.createComponent(type);
    f.detectChanges();
    if (router) {
        router.initialNavigation();
        advance(f);
    }
    return f;
}

class GlueService {
    testComponent: TestComponent;
}

@Component({
    selector: 'test-component',
    template: `
        <button type="button" class="btn btn-default" (click)="modal.open()" (onClose)="onClose()">Open me!</button>

        <modal #modal [animation]="animate">
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
class TestComponent {
    @ViewChild(ModalComponent)
    modal: ModalComponent;

    @Input()
    animate: boolean = true;

    constructor( @Inject(GlueService) glue: GlueService) {
        glue.testComponent = this;
    }
}

@Component({
    selector: 'test-component2',
    template: `{{message}}`,
})
class TestComponent2 {
    message: string = 'hello';
}

@Component({
    selector: 'app-component',
    template: `
        <router-outlet></router-outlet>
    `
})
class RootComponent {
    constructor( @Inject(GlueService) public glue: GlueService) {
    }
}

@NgModule({
    imports: [RouterTestingModule, Ng2Bs3ModalModule, CommonModule],
    providers: [GlueService],
    declarations: [TestComponent, TestComponent2, RootComponent],
    exports: [TestComponent, TestComponent2, RootComponent]
})
class TestModule {
}
