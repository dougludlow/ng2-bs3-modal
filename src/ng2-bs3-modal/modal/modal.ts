import { Component, OnChanges, OnDestroy, Input, Output, EventEmitter, ElementRef, HostBinding, Inject, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/partition';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';

import { BsModalCloseEvent, BsModalCloseSource, BsModalOptions, BsModalSize } from './models';
import { BsModalService } from './modal-service';
import '../utils/to-event-emitter';

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
export class BsModalComponent implements OnDestroy, OnChanges {

    private overrideSize: string = null;
    private $modal: JQuery;
    private onManualClose: Subject<{}> = new Subject<{}>();
    private onShown: Observable<{}>;
    private onHidden: Observable<BsModalCloseSource>;
    private get options() {
        if (!this.$modal) this.init();
        return this.$modal.data(DATA_KEY).options;
    }

    public visible = false;

    @Input() public animation = true;
    @Input() public backdrop: string | boolean = true;
    @Input() public keyboard = true;
    @Input() public size: string;
    @Input() public cssClass: string;

    @Output() public onClose: EventEmitter<any>;
    @Output() public onDismiss: EventEmitter<any>;
    @Output() public onOpen: EventEmitter<any>;
    @Output() public onShow: EventEmitter<Event>;
    @Output() public onHide: EventEmitter<any>;
    @Output() public onLoaded: EventEmitter<any>;

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

    public ngOnChanges() {
        this.setOptions({
            backdrop: this.backdrop,
            keyboard: this.keyboard
        });
    }

    public ngOnDestroy() {
        this.service.remove(this);
        return this.hide().do(() => {
            if (this.$modal) {
                console.log('destroy');
                this.$modal.data(DATA_KEY, null);
                this.$modal.remove();
                this.$modal = null;
            }
        }).toPromise();
    }

    public routerCanDeactivate(): any {
        return this.ngOnDestroy();
    }

    public open(size?: string) {
        if (BsModalSize.isValidSize(size)) this.overrideSize = size;
        return this.show().toPromise();
    }

    public close(value?: any): Promise<{}> {
        this.onManualClose.next(BsModalCloseSource.Confirm);
        return this.hide().toPromise();
    }

    public dismiss(): Promise<{}> {
        this.onManualClose.next(BsModalCloseSource.Dismiss);
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

    private show(): Observable<{}> {
        return Observable.create((o: Observer<any>) => {
            if (!this.visible) {
                this.onShown.first().subscribe((next) => {
                    o.next(next);
                    o.complete();
                });
                this.$modal.modal('show');
            }
            else {
                o.next(null);
                o.complete();
            }
        });
    }

    private hide(): Observable<BsModalCloseSource> {
        return Observable.create((o: Observer<BsModalCloseSource>) => {
            if (this.visible) {
                this.onHidden.first().subscribe((next) => {
                    o.next(next);
                    o.complete();
                });
                this.$modal.modal('hide');
            }
            else {
                o.next(null);
                o.complete();
            }
        });
    }

    private init() {
        this.$modal = jQuery(this.element.nativeElement);
        this.$modal.appendTo('body');
        this.$modal.modal({
            show: false
        });

        const onHideEvent = Observable.fromEvent(this.$modal, HIDE_EVENT_NAME);
        const onHiddenEvent = Observable.fromEvent(this.$modal, HIDDEN_EVENT_NAME);

        const onClose = Observable
            .merge(this.onManualClose, this.service.onBackdropClose, this.service.onKeyboardClose)
            .share();

        this.onHide = Observable.zip(onHideEvent, onClose)
            .map(x => <BsModalCloseEvent>{ event: x[0], type: x[1] })
            .toEventEmitter(this.zone);

        this.onHidden = Observable.zip(onHiddenEvent, onClose)
            .map(x => x[1])
            .do(this.setVisible(false))
            .share();

        this.onShow = Observable.fromEvent(this.$modal, SHOW_EVENT_NAME).toEventEmitter(this.zone);
        this.onShown = Observable.fromEvent(this.$modal, SHOWN_EVENT_NAME)
            .do(this.setVisible(true))
            .share();

        const hidden = this.onHidden.partition((x) => x === BsModalCloseSource.Confirm);

        this.onClose = hidden[0].toEventEmitter(this.zone);
        this.onDismiss = hidden[1].toEventEmitter(this.zone);
        this.onOpen = this.onShown.do(() => this.visible = this.visible).toEventEmitter(this.zone);
        this.onShow = this.onShow.toEventEmitter(this.zone);
        this.onLoaded = Observable.fromEvent(this.$modal, LOADED_EVENT_NAME).toEventEmitter(this.zone);
    }

    private setVisible = (isVisible) => {
        return () => this.visible = isVisible;
    }

    private setOptions = (options: BsModalOptions) => {
        let backdrop = options.backdrop;
        if (typeof backdrop === 'string' && backdrop !== 'static')
            backdrop = true;

        if (options.backdrop !== undefined) this.options.backdrop = backdrop;
        if (options.keyboard !== undefined)this.options.keyboard = options.keyboard;
    }
}
