import {
    beforeEach,
    afterEach,
    ddescribe,
    xdescribe,
    describe,
    expect,
    iit,
    inject,
    beforeEachProviders,
    it,
    xit
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { SpyLocation } from '@angular/common/testing';
import { Component, ComponentResolver, ViewChild, ContentChild, provide, OnDestroy, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Routes, ROUTER_DIRECTIVES, RouterOutletMap, RouterUrlSerializer, DefaultRouterUrlSerializer } from '@angular/router';
import { ModalComponent, MODAL_DIRECTIVES } from '../src/ng2-bs3-modal/ng2-bs3-modal';

// Needed because ViewChild isn't resolved anymore in the new router
// https://github.com/angular/angular/issues/4452
class GlueService {
    testComponent: TestComponent;
}

describe('ModalComponent', () => {

    let modal: ModalComponent;
    let builder: TestComponentBuilder;
    let router: Router;
    let fixture: ComponentFixture<TestComponent>;
    let testComponent: TestComponent;
    let location: Location;
    let glue: GlueService;

    beforeEachProviders(() => [
        provide(RouterUrlSerializer, { useClass: DefaultRouterUrlSerializer }),
        RouterOutletMap,
        provide(Location, { useClass: SpyLocation }),
        provide(Router, {
            useFactory: (resolver, urlParser, outletMap, location) => new Router('RootComponent', TestAppComponent, resolver, urlParser, outletMap, location),
            deps: [ComponentResolver, RouterUrlSerializer, RouterOutletMap, Location]
        }),
        GlueService
    ]);

    beforeEach(inject([TestComponentBuilder, Router, Location, GlueService], (tcb, r, l, g) => {
        builder = tcb;
        router = r;
        location = l;
        glue = g;
    }));

    afterEach(() => {
        fixture && fixture.destroy();
    });

    it('should render', done => {
        builder.createAsync(TestComponent).then(f => {
            fixture = f;
            fixture.detectChanges();
            expect(document.querySelectorAll('.modal').length).toBe(1);
            done();
        });
    });

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
                (<HTMLElement>document.querySelector('.modal.in')).click();
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
                (<HTMLElement>document.querySelector('.modal.in')).click();
            });
    });

    it('should not throw an error when navigating on modal close', done => {
        builder.createAsync(TestAppComponent)
            .then(f => { fixture = f; })
            .then(() => router.navigateByUrl('/test1'))
            .then(() => {
                fixture.detectChanges(true);
                testComponent = glue.testComponent;
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
            .then(() => testComponent.modal.close())
            .catch((e) => console.error(e.stack));
    });

    it('should emit onOpen when modal is opened', done => {
        let times = 0;
        builder.createAsync(TestComponent)
            .then(f => { fixture = f; })
            .then(() => { testComponent = fixture.componentInstance; })
            .then(() => {
                fixture.detectChanges();
                testComponent.modal.onOpen.subscribe(() => {
                    done();
                });
            })
            .then(() => testComponent.modal.open());
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

    constructor(glue: GlueService) {
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
    directives: [ROUTER_DIRECTIVES],
    template: `
        <router-outlet></router-outlet>
    `
})
@Routes([
    { path: '/test1', component: TestComponent },
    { path: '/test2', component: TestComponent2 }
])
class TestAppComponent {
}