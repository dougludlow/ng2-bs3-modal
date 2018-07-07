import { Type, } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

export function createRoot<T>(type: Type<T>, router?: Router, detect = true): ComponentFixture<T> {
    const f = TestBed.createComponent<T>(type);
    if (detect) { f.detectChanges(); }
    if (router) {
        router.initialNavigation();
        advance(f);
    }
    return f;
}

export function advance(fixture: ComponentFixture<any>, millis?: number): void {
    tick(millis);
    fixture.detectChanges();
}

export function ticks(...millises: number[]): void {
    millises.forEach(m => tick(m));
}

export function removeModals() {
    Array.from(document.querySelectorAll('.modal')).forEach((x) => document.body.removeChild(x));
}
