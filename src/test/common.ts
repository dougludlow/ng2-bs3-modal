import { Type, } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

export function createRoot<T>(type: Type<T>, router?: Router): ComponentFixture<T> {
    const f = TestBed.createComponent(type);
    f.detectChanges();
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
