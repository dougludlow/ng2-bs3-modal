import { Observable } from 'rxjs/Observable';
import { EventEmitter, NgZone } from '@angular/core';

Observable.prototype.toEventEmitter = toEventEmitter;

export function toEventEmitter<T>(this: Observable<T>, zone: NgZone): EventEmitter<T> {
    const emitter = new EventEmitter<T>(true);
    this.subscribe((next) => {
        zone.run(() => {
            emitter.next(next);
        });
    });
    return emitter;
}

declare module 'rxjs/Observable' {
    // tslint:disable-next-line:no-shadowed-variable
    interface Observable<T> {
        toEventEmitter: typeof toEventEmitter;
    }
}
