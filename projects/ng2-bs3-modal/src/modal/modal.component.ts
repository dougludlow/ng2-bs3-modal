// tslint:disable:no-output-on-prefix
import {
    Component,
    OnInit,
    AfterViewInit,
    OnChanges,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    HostBinding,
    NgZone
} from '@angular/core';
import { Observable, Observer, Subject, Subscription, of as observableOf, fromEvent, merge, zip } from 'rxjs';
import { take, filter, tap, share, map } from 'rxjs/operators';

import { BsModalHideEvent, BsModalHideType, BsModalOptions, BsModalSize } from './models';
import { BsModalService } from './modal.service';

const EVENT_SUFFIX = 'ng2-bs3-modal';
const SHOW_EVENT_NAME = `show.bs.modal.${EVENT_SUFFIX}`;
const SHOWN_EVENT_NAME = `shown.bs.modal.${EVENT_SUFFIX}`;
const HIDE_EVENT_NAME = `hide.bs.modal.${EVENT_SUFFIX}`;
const HIDDEN_EVENT_NAME = `hidden.bs.modal.${EVENT_SUFFIX}`;
const LOADED_EVENT_NAME = `loaded.bs.modal.${EVENT_SUFFIX}`;
const DATA_KEY = 'bs.modal';

@Component({
    selector: 'bs-modal',
    template: `
        <div class="modal-dialog" [ngClass]="getCssClasses()">
            <div class="modal-content">
                <ng-content></ng-content>
            </div>
        </div>
    `
})
export class BsModalComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    private overrideSize: string = null;
    private $modal: JQuery;
    private $dialog: JQuery;
    private onShowEvent$: Observable<Event>;
    private onShownEvent$: Observable<Event>;
    private onHideEvent$: Observable<Event>;
    private onHiddenEvent$: Observable<Event>;
    private onLoadedEvent$: Observable<Event>;
    private onShown$: Observable<{}>;
    private onInternalClose$: Subject<BsModalHideType> = new Subject<BsModalHideType>();
    private onDismiss$: Observable<BsModalHideType>;
    private onHide$: Observable<BsModalHideEvent>;
    private onHidden$: Observable<BsModalHideType>;
    private subscriptions: Subscription[] = [];
    private get options() {
        if (!this.$modal) {
            this.init();
        }
        return this.$modal.data(DATA_KEY).options;
    }

    visible = false;
    showing = false;
    hiding = false;

    @Input() animation = true;
    @Input() backdrop: string | boolean = true;
    @Input() keyboard = true;
    @Input() size: string;
    @Input() cssClass: string;

    @Output() onShow = new EventEmitter<Event>();
    @Output() onOpen = new EventEmitter<any>();
    @Output() onHide = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();
    @Output() onDismiss = new EventEmitter<BsModalHideType>();
    @Output() onLoaded = new EventEmitter<any>();

    @HostBinding('class.fade')
    get fadeClass() { return this.animation; }

    @HostBinding('class.modal')
    get modalClass() { return true; }

    @HostBinding('attr.role')
    get roleAttr() { return 'dialog'; }

    @HostBinding('attr.tabindex')
    get tabindexAttr() { return '-1'; }

    constructor(private element: ElementRef, private service: BsModalService, private zone: NgZone) {
        this.service.add(this);
        this.init();
    }

    ngOnInit() {
        this.wireUpEventEmitters();
    }

    ngAfterViewInit() {
        this.$dialog = this.$modal.find('.modal-dialog');
    }

    ngOnChanges() {
        this.setOptions({
            backdrop: this.backdrop,
            keyboard: this.keyboard
        });
    }

    ngOnDestroy() {
        this.onInternalClose$.next(BsModalHideType.Destroy);
        return this.destroy();
    }

    focus() {
        this.$modal.trigger('focus');
    }

    routerCanDeactivate(): any {
        this.onInternalClose$.next(BsModalHideType.RouteChange);
        return this.destroy();
    }

    open(size?: string) {
        this.overrideSize = null;
        if (BsModalSize.isValidSize(size)) {
            this.overrideSize = size;
        }
        return this.show().toPromise();
    }

    close(value?: any): Promise<{}> {
        this.onInternalClose$.next(BsModalHideType.Close);
        return this.hide().pipe(
            tap(() => this.onClose.emit(value)),
        ).toPromise().then(() => value);
    }

    dismiss(): Promise<{}> {
        this.onInternalClose$.next(BsModalHideType.Dismiss);
        return this.hide().toPromise();
    }

    getCssClasses(): string {
        const classes: string[] = [];

        if (this.isSmall()) {
            classes.push('modal-sm');
        }

        if (this.isLarge()) {
            classes.push('modal-lg');
        }

        if (this.cssClass) {
            classes.push(this.cssClass);
        }

        return classes.join(' ');
    }

    private isSmall() {
        return this.overrideSize !== BsModalSize.Large
            && this.size === BsModalSize.Small
            || this.overrideSize === BsModalSize.Small;
    }

    private isLarge() {
        return this.overrideSize !== BsModalSize.Small
            && this.size === BsModalSize.Large
            || this.overrideSize === BsModalSize.Large;
    }

    private show(): Observable<any> {
        if (this.visible && !this.hiding) {
            return observableOf(null);
        }
        this.showing = true;

        return Observable.create((o: Observer<any>) => {
            this.onShown$.pipe(
                take(1),
            ).subscribe(next => {
                o.next(next);
                o.complete();
            });

            this.transitionFix();
            this.$modal.modal('show');
        });
    }

    private transitionFix() {
        // Fix for shown.bs.modal not firing when .fade is present
        // https://github.com/twbs/bootstrap/issues/11793
        if (this.animation) {
            setTimeout(() => {
                this.$modal.trigger('focus').trigger(SHOWN_EVENT_NAME);
            }, jQuery.fn.modal['Constructor'].TRANSITION_DURATION);
        }
    }

    private hide(): Observable<BsModalHideType> {
        if (!this.visible && !this.showing) {
            return observableOf<BsModalHideType>(null);
        }
        this.hiding = true;

        return Observable.create((o: Observer<any>) => {
            this.onHidden$.pipe(
                take(1)
            ).subscribe(next => {
                o.next(next);
                o.complete();
            });

            this.$modal.modal('hide');
        });
    }

    private init() {
        this.$modal = jQuery(this.element.nativeElement);
        this.$modal.appendTo(document.body);
        this.$modal.modal({
            show: false
        });

        this.onShowEvent$ = fromEvent(this.$modal, SHOW_EVENT_NAME);
        this.onShownEvent$ = fromEvent(this.$modal, SHOWN_EVENT_NAME);
        this.onHideEvent$ = fromEvent(this.$modal, HIDE_EVENT_NAME);
        this.onHiddenEvent$ = fromEvent(this.$modal, HIDDEN_EVENT_NAME);
        this.onLoadedEvent$ = fromEvent(this.$modal, LOADED_EVENT_NAME);

        const onClose$ = merge(this.onInternalClose$, this.service.onBackdropClose$, this.service.onKeyboardClose$);

        this.onHide$ = zip(this.onHideEvent$, onClose$).pipe(
            map(x => <BsModalHideEvent>{ event: x[0], type: x[1] }),
        );

        this.onHidden$ = zip<BsModalHideType>(this.onHiddenEvent$, onClose$).pipe(
            map(x => x[1]),
            tap(this.setVisible(false)),
            tap(() => this.service.focusNext()),
            share(),
        );

        this.onShown$ = this.onShownEvent$.pipe(
            tap(this.setVisible(true)),
            share()
        );

        this.onDismiss$ = this.onHidden$.pipe(
            filter((x) => x !== BsModalHideType.Close)
        );

        // Start watching for events
        this.subscriptions.push(...[
            this.onShown$.subscribe(() => { }),
            this.onHidden$.subscribe(() => { }),
            this.service.onModalStack$.subscribe(() => { })
        ]);
    }

    private wireUpEventEmitters() {

        this.wireUpEventEmitter(this.onShow, this.onShowEvent$);
        this.wireUpEventEmitter(this.onOpen, this.onShown$);
        this.wireUpEventEmitter(this.onHide, this.onHide$);
        this.wireUpEventEmitter(this.onDismiss, this.onDismiss$);
        this.wireUpEventEmitter(this.onLoaded, this.onLoadedEvent$);
    }

    private wireUpEventEmitter<T>(emitter: EventEmitter<T>, stream$: Observable<T>) {
        if (emitter.observers.length === 0) {
            return;
        }

        const sub = stream$.subscribe((next) => {
            this.zone.run(() => {
                emitter.next(next);
            });
        });

        this.subscriptions.push(sub);
    }

    private setVisible = (isVisible) => {
        return () => {
            this.visible = isVisible;
            this.showing = false;
            this.hiding = false;
        };
    }

    private setOptions = (options: BsModalOptions) => {
        let backdrop = options.backdrop;
        if (typeof backdrop === 'string' && backdrop !== 'static') {
            backdrop = true;

        }

        if (options.backdrop !== undefined) {
            this.options.backdrop = backdrop;
        }
        if (options.keyboard !== undefined) {
            this.options.keyboard = options.keyboard;
        }
    }

    private destroy() {
        return this.hide().pipe(
            tap(() => {
                this.service.remove(this);
                this.subscriptions.forEach(s => s.unsubscribe());
                this.subscriptions = [];
                if (this.$modal) {
                    this.$modal.data(DATA_KEY, null);
                    this.$modal.remove();
                    this.$modal = null;
                }
            })
        ).toPromise();
    }
}
