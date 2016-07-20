import {Location, LocationStrategy} from '@angular/common';
import {SpyLocation} from '@angular/common/testing';
//import {MockLocationStrategy} from '@angular/common/testing';
import {Component, Injector, ComponentResolver} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanDeactivate, DefaultUrlSerializer, Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Params, ROUTER_DIRECTIVES,  Router, RouterConfig, RouterOutletMap, RouterStateSnapshot, RoutesRecognized, UrlSerializer} from '@angular/router';


export function provideTestRouter(RootCmp:any, config: RouterConfig):any[]{
    return [
        RouterOutletMap,
        {provide: UrlSerializer, useClass: DefaultUrlSerializer},
        {provide: Location, useClass: SpyLocation},
        //{provide: LocationStrategy, useClass: MockLocationStrategy},
        {
            provide: Router,
            useFactory: (resolver: ComponentResolver, urlSerializer: UrlSerializer, outletMap: RouterOutletMap, location: Location, injector: Injector) => {
                return new (<any>Router)(
                    RootCmp, resolver, urlSerializer, outletMap, location, injector, config);
            },
            deps: [ComponentResolver, UrlSerializer, RouterOutletMap, Location, Injector]
        },
        {provide: ActivatedRoute, useFactory: (r: Router) => r.routerState.root, deps: [Router]},
    ];
};