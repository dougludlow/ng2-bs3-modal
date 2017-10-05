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
    Inject,
    NgZone
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { JQueryStyleEventEmitter } from 'rxjs/observable/FromEventObservable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';

import { BsModalHideEvent, BsModalHideType, BsModalOptions, BsModalSize } from './models';
import { BsModalService } from './modal-service';

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
        if (!this.$modal) this.init();
        return this.$modal.data(DATA_KEY).options;
    }

    public visible = false;
    public showing = false;
    public hiding = false;

    @Input() public animation = true;
    @Input() public backdrop: string | boolean = true;
    @Input() public keyboard = true;
    @Input() public size: string;
    @Input() public cssClass: string;

    @Output() public onShow: EventEmitter<Event> = new EventEmitter<any>();
    @Output() public onOpen: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onHide: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onClose: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onDismiss: EventEmitter<BsModalHideType> = new EventEmitter<BsModalHideType>();
    @Output() public onLoaded: EventEmitter<any> = new EventEmitter<any>();

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

    public ngOnInit() {
        this.wireUpEventEmitters();
    }

    public ngAfterViewInit() {
        this.$dialog = this.$modal.find('.modal-dialog');
    }

    public ngOnChanges() {
        this.setOptions({
            backdrop: this.backdrop,
            keyboard: this.keyboard
        });
    }

    public ngOnDestroy() {
        this.onInternalClose$.next(BsModalHideType.Destroy);
        return this.destroy();
    }

    public focus() {
        this.$modal.trigger('focus');
    }

    public routerCanDeactivate(): any {
        this.onInternalClose$.next(BsModalHideType.RouteChange);
        return this.destroy();
    }

    public open(size?: string) {
        this.overrideSize = null;
        if (BsModalSize.isValidSize(size)) this.overrideSize = size;
        return this.show().toPromise();
    }

    public close(value?: any): Promise<{}> {
        this.onInternalClose$.next(BsModalHideType.Close);
        return this.hide()
            .do(() => this.onClose.emit(value))
            .toPromise()
            .then(() => value);
    }

    public dismiss(): Promise<{}> {
        this.onInternalClose$.next(BsModalHideType.Dismiss);
        return this.hide().toPromise();
    }

    public getCssClasses(): string {
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
        if (this.visible && !this.hiding) return Observable.of(null);
        this.showing = true;

        return Observable.create((o: Observer<any>) => {
            this.onShown$.take(1).subscribe(next => {
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
            }, $.fn.modal['Constructor'].TRANSITION_DURATION);
        }
    }

    private hide(): Observable<BsModalHideType> {
        if (!this.visible && !this.showing) return Observable.of<BsModalHideType>(null);
        this.hiding = true;

        return Observable.create((o: Observer<any>) => {
            this.onHidden$.take(1).subscribe(next => {
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

        this.onShowEvent$ = Observable.fromEvent(this.$modal as JQueryStyleEventEmitter, SHOW_EVENT_NAME);
        this.onShownEvent$ = Observable.fromEvent(this.$modal as JQueryStyleEventEmitter, SHOWN_EVENT_NAME);
        this.onHideEvent$ = Observable.fromEvent(this.$modal as JQueryStyleEventEmitter, HIDE_EVENT_NAME);
        this.onHiddenEvent$ = Observable.fromEvent(this.$modal as JQueryStyleEventEmitter, HIDDEN_EVENT_NAME);
        this.onLoadedEvent$ = Observable.fromEvent(this.$modal as JQueryStyleEventEmitter, LOADED_EVENT_NAME);

        const onClose$ = Observable
            .merge(this.onInternalClose$, this.service.onBackdropClose$, this.service.onKeyboardClose$);

        this.onHide$ = Observable.zip(this.onHideEvent$, onClose$)
            .map(x => <BsModalHideEvent>{ event: x[0], type: x[1] });

        this.onHidden$ = Observable.zip<BsModalHideType>(this.onHiddenEvent$, onClose$)
            .map(x => x[1])
            .do(this.setVisible(false))
            .do(() => this.service.focusNext())
            .share();

        this.onShown$ = this.onShownEvent$
            .do(this.setVisible(true))
            .share();

        this.onDismiss$ = this.onHidden$
            .filter((x) => x !== BsModalHideType.Close);

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
        if (emitter.observers.length === 0) return;

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
        }
    }

    private setOptions = (options: BsModalOptions) => {
        let backdrop = options.backdrop;
        if (typeof backdrop === 'string' && backdrop !== 'static')
            backdrop = true;

        if (options.backdrop !== undefined) this.options.backdrop = backdrop;
        if (options.keyboard !== undefined) this.options.keyboard = options.keyboard;
    }

    private destroy() {
        return this.hide().do(() => {
            this.service.remove(this);
            this.subscriptions.forEach(s => s.unsubscribe());
            this.subscriptions = [];
            if (this.$modal) {
                this.$modal.data(DATA_KEY, null);
                this.$modal.remove();
                this.$modal = null;
            }
        }).toPromise();
    }
}
