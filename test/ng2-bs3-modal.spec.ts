import { APP_BASE_HREF } from '@angular/common';
import { async, inject, addProviders, ComponentFixture, TestComponentBuilder } from '@angular/core/testing';
import { Injectable, Input, Injector, Component, ComponentResolver, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ROUTER_DIRECTIVES, RouterOutletMap, provideRouter, RouterConfig, DefaultUrlSerializer, UrlSerializer, ActivatedRoute } from '@angular/router';
import { SpyLocation } from '@angular/common/testing';

import { ModalComponent, MODAL_DIRECTIVES } from '../src/ng2-bs3-modal/ng2-bs3-modal';


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
@Injectable()
class TestAppComponent {
}


describe('ModalComponent', () => {

    let fixture: ComponentFixture;
    let component: TestAppComponent;
    let router: Router;

    const routes: RouterConfig = [
        {path: 'test1', component: TestComponent},
        {path: 'test2', component: TestComponent2}
    ];

    beforeEach(() => {
        addProviders([
            provideRouter(routes),
            {provide: APP_BASE_HREF, useValue: '/TestAppComponent'},
            {provide: UrlSerializer, useClass: DefaultUrlSerializer},

            RouterOutletMap,
            {provide: UrlSerializer, useClass: DefaultUrlSerializer},
            {provide: Location, useClass: SpyLocation},
            {
                provide: Router,
                useFactory: (resolver: ComponentResolver, urlSerializer: UrlSerializer, outletMap: RouterOutletMap, location: Location, injector: Injector) => {
                    return new (<any>Router)(
                        TestAppComponent, resolver, urlSerializer, outletMap, location, injector, routes);
                },
                deps: [ComponentResolver, UrlSerializer, RouterOutletMap, Location, Injector]
            },
            {provide: ActivatedRoute, useFactory: (r: Router) => r.routerState.root, deps: [Router]}
        ]);
    });

    beforeEach(async(inject([TestComponentBuilder, Router], (builder, r) => {
        router = r;
        return builder
            .createAsync(TestComponent)
            .then((componentFixture: ComponentFixture) => {
                fixture = componentFixture;
                component = componentFixture.componentInstance;
            });
    })));

    afterEach(() => {
        fixture && fixture.destroy();
    });

    it('should render', () => {
        fixture.detectChanges();
        expect(document.querySelectorAll('.modal').length).toBe(1);
    });

    it('should cleanup when destroyed', done => {
        fixture.detectChanges();
        component.modal.ngOnDestroy();
        setTimeout(() => {
            expect(document.querySelectorAll('.modal').length).toBe(0);
            done();
        }, 1000);
    });

    it('should emit onClose when modal is closed', done => {
        fixture.detectChanges();
        component.modal.onClose.subscribe(() => {
            done();
        });
        component.modal.open()
            .then(() => { component.modal.close(); });
    });

    it('should emit onClose when modal is closed and animation is disabled', done => {
        component.animate = false;
        fixture.detectChanges();
        component.modal.onClose.subscribe(() => {
            done();
        });
        component.modal.open()
            .then(() => { component.modal.close(); });
    });

    it('should emit onDismiss when modal is dimissed', done => {
        component.modal.onDismiss.subscribe(() => {
            done();
        });
        component.modal.open()
            .then(() => { component.modal.dismiss(); });
    });

    it('should emit onDismiss only once', done => {
        let times = 0;

        setTimeout(() => {
            expect(times).toBe(1);
            done();
        }, 1000);

        fixture.detectChanges();
        component.modal.onDismiss.subscribe(() => {
            times++;
        });
        component.modal.open()
            .then(() => { component.modal.dismiss(); });

    });

    it('should emit onDismiss when modal is dismissed and animation is disabled', done => {
        component.animate = false;
        fixture.detectChanges();
        component.modal.onDismiss.subscribe(() => {
            done();
        });
        component.modal.open()
            .then(() => { component.modal.dismiss(); });
    });

    it('should emit onDismiss when modal is dismissed a second time from backdrop', done => {
        let times = 0;

        fixture.detectChanges();
        component.modal.onDismiss.subscribe(() => {
            times++;
            if (times === 2) done();
        });
        component.modal.open()
            .then(() => { component.modal.dismiss(); })
            .then(() => { component.modal.open(); })
            .then(() => { (<HTMLElement>document.querySelector('.modal')).click(); });
    });

    it('should emit onDismiss when modal is closed, opened, then dimissed from backdrop', done => {        // component.animate = false;
        fixture.detectChanges();
        component.modal.onDismiss.subscribe(() => {
            done();
        });
        component.modal.open()
            .then(() => { component.modal.close(); })
            .then(() => { component.modal.open(); })
            .then(() => { (<HTMLElement>document.querySelector('.modal')).click(); })

    });

    it('should emit onOpen when modal is opened', done => {
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.modal.onOpen.subscribe(() => {
            done();
        });
        component.modal.open();
    });

    describe('Routing', () => {
        let appFixture: ComponentFixture;
        let appComponent: TestAppComponent;

        afterEach(() => {
            appFixture && appFixture.destroy();
        });

        beforeEach(async(inject([TestComponentBuilder], (builder) => {
            builder.createAsync(TestAppComponent)
                .then((componentFixture: ComponentFixture) => {
                    appFixture = componentFixture;
                    appComponent = componentFixture.componentInstance;
                });
        }

        it('should not throw an error when navigating on modal close', done => {
            router.navigateByUrl('/test1');

            fixture.detectChanges(true);
            component.modal.onClose.subscribe(() => {
                router.navigateByUrl('/test2').then(() => {
                    fixture.detectChanges();
                    let content = fixture.debugElement.nativeElement.querySelector('test-component2');
                    expect(content).toHaveText('hello');
                    setTimeout(() => done(), 1000);
                });
            });
            component.modal.open()
                .then(() => { component.modal.close(); });

            done()
        });
    });
});
