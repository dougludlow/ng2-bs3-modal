import {
    async,
    inject,
    addProviders,
    ComponentFixture,
    TestComponentBuilder
} from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import {
    Injector,
    Component,
    ComponentResolver,
    ViewChild,
    Input
} from '@angular/core';
import{
    APP_BASE_HREF
} from '@angular/common';
import { Location } from '@angular/common';
import {
    Router,
    ROUTER_DIRECTIVES,
    RouterOutletMap,
    provideRouter,
    RouterConfig,
    DefaultUrlSerializer,
    UrlSerializer,
    ActivatedRoute
} from '@angular/router';
import { ModalComponent, MODAL_DIRECTIVES } from '../src/ng2-bs3-modal/ng2-bs3-modal';
//import 'zone.js'

// Needed because ViewChild isn't resolved anymore in the new router
// https://github.com/angular/angular/issues/4452
class GlueService {
    testComponent: TestComponent;
}

class MockRouter {

}


describe('ModalComponent', () => {

    let fixture: ComponentFixture;
    let component: TestComponent;
    let router: Router;

    const routes: RouterConfig = [
        {path: 'test1', component: TestComponent},
        {path: 'test2', component: TestComponent2}
    ];

    beforeEach(() => {

        addProviders([
            GlueService,
            provideRouter(routes),
            {provide: APP_BASE_HREF, useValue: '/'},
            {provide: UrlSerializer, useClass: DefaultUrlSerializer},

            RouterOutletMap,
            {provide: UrlSerializer, useClass: DefaultUrlSerializer},
            {provide: Location, useClass: SpyLocation},
            //{provide: LocationStrategy, useClass: MockLocationStrategy},
            {
                provide: Router,
                useFactory: (resolver: ComponentResolver, urlSerializer: UrlSerializer, outletMap: RouterOutletMap, location: Location, injector: Injector) => {
                    return new (<any>Router)(
                        TestComponent, resolver, urlSerializer, outletMap, location, injector, routes);
                },
                deps: [ComponentResolver, UrlSerializer, RouterOutletMap, Location, Injector]
            },
            {provide: ActivatedRoute, useFactory: (r: Router) => r.routerState.root, deps: [Router]},
        ]);

    });

    beforeEach(async(inject([TestComponentBuilder], (tcb) => {

        //router = r;
        return tcb
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
        component.modal.open();
        component.modal.close();
    });

    it('should emit onClose when modal is closed and animation is disabled', done => {
        component.animate = false;
        fixture.detectChanges();
        component.modal.onClose.subscribe(() => {
            done();
        });
        component.modal.open();
        component.modal.close();
    });

    it('should emit onDismiss when modal is dimissed', done => {
        component.modal.onDismiss.subscribe(() => {
            done();
        });
        component.modal.open();
        component.modal.dismiss();
    });

    // failing
    it('should emit onDismiss only once', done => {
        let times = 0;

        fixture.detectChanges();
        component.modal.onDismiss.subscribe(() => {
            times++;
            expect(times).toBe(1);
            if (times === 1) {
                done();
            }
        });
        component.modal.open();
        component.modal.dismiss();

    });

    it('should emit onDismiss when modal is dismissed and animation is disabled', done => {
        component.animate = false;
        fixture.detectChanges();
        component.modal.onDismiss.subscribe(() => {
            done();
        });
        component.modal.open();
        component.modal.dismiss();
    });

    xit('should emit onDismiss when modal is dismissed a second time from backdrop', done => {
        let times = 0;

        fixture.detectChanges();
        component.modal.onDismiss.subscribe(() => {
            times++;
            if (times === 2) done();
        });
        component.modal.open();
        component.modal.dismiss();
        component.modal.open();
        (<HTMLElement>document.querySelector('.modal.in')).click();
    });

    xit('should emit onDismiss when modal is closed, opened, then dimissed from backdrop', done => {
        fixture.detectChanges();
        component.modal.onDismiss.subscribe(() => {
            done();
        });
        component.modal.open();
        component.modal.close();
        component.modal.open();
        //console.log('click 1');
        //(<HTMLElement>document.querySelector('.modal.in')).click();
        //component.modal.dismiss();

    });

    xit('should not throw an error when navigating on modal close', done => {
        router.navigateByUrl('/test1');

        fixture.detectChanges(true);
        component = glue.testComponent;
        component.modal.onClose.subscribe(() => {
            router.navigateByUrl('/test2').then(() => {
                fixture.detectChanges();
                let content = fixture.debugElement.nativeElement.querySelector('test-component2');
                expect(content).toHaveText('hello');
                setTimeout(() => done(), 1000);
            });
        });

        component.modal.open();
        component.modal.close();
    });

    it('should emit onOpen when modal is opened', done => {
        let times = 0;
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.modal.onOpen.subscribe(() => {
            done();
        });
        component.modal.open();
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
class TestAppComponent {
}