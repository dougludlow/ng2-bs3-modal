import {
    beforeEach,
    beforeEachProviders,
    afterEach,
    describe,
    expect,
    it,
    inject,
    injectAsync,
    setBaseTestProviders,
    TestComponentBuilder,
    ComponentFixture,
} from 'angular2/testing';
import { DirectiveResolver } from 'angular2/src/core/linker/directive_resolver';
import { SpyLocation } from 'angular2/src/mock/location_mock';
import { TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS } from 'angular2/platform/testing/browser';
import { MockApplicationRef } from 'angular2/src/mock/mock_application_ref';
import { DynamicComponentLoader } from 'angular2/src/core/linker/dynamic_component_loader';
import { Component, ViewChild, ApplicationRef, provide, OnDestroy, Input } from 'angular2/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PRIMARY_COMPONENT, RouteRegistry, Location } from 'angular2/router';
import { RootRouter } from 'angular2/src/router/router';
import { ModalComponent, MODAL_DIRECTIVES } from '../src/ng2-bs3-modal/ng2-bs3-modal';

describe('ModalComponent', () => {

    setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS);

    let modal: ModalComponent;
    let builder: TestComponentBuilder;
    let router: Router;
    let fixture: ComponentFixture;
    let testComponent: TestComponent;

    beforeEachProviders(() => [
        RouteRegistry,
        DirectiveResolver,
        provide(Location, { useClass: SpyLocation }),
        provide(ROUTER_PRIMARY_COMPONENT, { useValue: TestAppComponent }),
        provide(Router, { useClass: RootRouter })
    ]);

    beforeEach(inject([TestComponentBuilder, Router], (tcb, r) => {
        builder = tcb;
        router = r;
    }));

    afterEach(() => {
        fixture && fixture.destroy();
    });

    it('should render',
        injectAsync([TestComponentBuilder], (builder: TestComponentBuilder) => {
            return builder.createAsync(TestComponent).then(f => {
                fixture = f;
                fixture.detectChanges();
                expect(document.querySelectorAll('.modal').length).toBe(1);
            });
        }));

    it('should cleanup when destroyed', done => {
        builder.createAsync(TestComponent).then(f => {
            fixture = f;
            testComponent = fixture.componentInstance;
            fixture.detectChanges();
            testComponent.modal.ngOnDestroy();
            setTimeout(() => {
                expect(document.querySelectorAll('.modal').length).toBe(0);
                done();
            }, 1000);
        });
    });

    it('should emit onClose when modal is closed', done => {
        builder.createAsync(TestComponent)
            .then(f => { fixture = f; })
            .then(() => { testComponent = fixture.componentInstance; })
            .then(() => {
                fixture.detectChanges();
                testComponent.modal.onClose.subscribe(() => {
                    done();
                });
            })
            .then(() => testComponent.modal.open())
            .then(() => testComponent.modal.close());
    });

    it('should emit onClose when modal is closed and animation is disabled', done => {
        builder.createAsync(TestComponent)
            .then(f => { fixture = f; })
            .then(() => { testComponent = fixture.componentInstance; })
            .then(() => {
                testComponent.animate = false;
                fixture.detectChanges();
                testComponent.modal.onClose.subscribe(() => {
                    done();
                });
            })
            .then(() => testComponent.modal.open())
            .then(() => testComponent.modal.close());
    });

    it('should emit onDismiss when modal is dimissed', done => {
        builder.createAsync(TestComponent)
            .then(f => { fixture = f; })
            .then(() => { testComponent = fixture.componentInstance; })
            .then(() => {
                fixture.detectChanges();
                testComponent.modal.onDismiss.subscribe(() => {
                    done();
                });
            })
            .then(() => testComponent.modal.open())
            .then(() => testComponent.modal.dismiss());
    });

    it('should emit onDismiss only once', done => {
        let times = 0;

        setTimeout(() => {
            expect(times).toBe(1);
            done();
        }, 1000);

        builder.createAsync(TestComponent)
            .then(f => { fixture = f; })
            .then(() => { testComponent = fixture.componentInstance; })
            .then(() => {
                fixture.detectChanges();
                testComponent.modal.onDismiss.subscribe(() => {
                    times++;
                });
            })
            .then(() => testComponent.modal.open())
            .then(() => testComponent.modal.dismiss());
    });

    it('should emit onDismiss when modal is dimissed and animation is disabled', done => {
        builder.createAsync(TestComponent)
            .then(f => { fixture = f; })
            .then(() => { testComponent = fixture.componentInstance; })
            .then(() => {
                testComponent.animate = false;
                fixture.detectChanges();
                testComponent.modal.onDismiss.subscribe(() => {
                    done();
                });
            })
            .then(() => testComponent.modal.open())
            .then(() => testComponent.modal.dismiss());
    });

    it('should emit onDismiss when modal is dimissed a second time from backdrop', done => {
        let times = 0;
        builder.createAsync(TestComponent)
            .then(f => { fixture = f; })
            .then(() => { testComponent = fixture.componentInstance; })
            .then(() => {
                fixture.detectChanges();
                testComponent.modal.onDismiss.subscribe(() => {
                    times++;
                    if (times === 2) done();
                });
            })
            .then(() => testComponent.modal.open())
            .then(() => testComponent.modal.dismiss())
            .then(() => testComponent.modal.open())
            .then(() => {
                document.querySelector('.modal.in').click();
            });
    });

    it('should emit onDismiss when modal is closed, opened, then dimissed from backdrop', done => {
        let times = 0;
        builder.createAsync(TestComponent)
            .then(f => { fixture = f; })
            .then(() => { testComponent = fixture.componentInstance; })
            .then(() => {
                fixture.detectChanges();
                testComponent.modal.onDismiss.subscribe(() => {
                    done();
                });
            })
            .then(() => testComponent.modal.open())
            .then(() => testComponent.modal.close())
            .then(() => testComponent.modal.open())
            .then(() => {
                document.querySelector('.modal.in').click();
            });
    });

    it('should not throw an error when navigating on modal close', done => {
        builder.createAsync(TestAppComponent)
            .then(f => { fixture = f; })
            .then(() => router.navigateByUrl('/test1'))
            .then(() => {
                fixture.detectChanges();
                testComponent = fixture.componentInstance.testComponent;
                testComponent.modal.onClose.subscribe(() => {
                    router.navigateByUrl('/test2').then(() => {
                        fixture.detectChanges();
                        let content = fixture.debugElement.nativeElement.querySelector('test-component2');
                        expect(content).toHaveText('hello');
                        setTimeout(() => done(), 1000);
                    });
                });
            })
            .then(() => testComponent.modal.open())
            .then(() => testComponent.modal.close());
    });
});

@Component({
    selector: 'test-component',
    directives: [MODAL_DIRECTIVES],
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

    @Input() animate: boolean = true;
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
    directives: [ROUTER_DIRECTIVES],
    template: `
        <router-outlet></router-outlet>
    `
})
@RouteConfig([
    { path: '/test1', component: TestComponent },
    { path: '/test2', component: TestComponent2 }
])
class TestAppComponent {
    @ViewChild(TestComponent)
    testComponent: TestComponent;
} 