import { AfterViewInit, EventEmitter } from 'angular2/core';
export declare class ModalComponent implements AfterViewInit {
    id: string;
    $modal: any;
    result: ModalResult;
    hiding: boolean;
    overrideSize: string;
    animation: boolean;
    backdrop: string;
    keyboard: boolean;
    size: string;
    onClose: EventEmitter<string>;
    ngAfterViewInit(): void;
    open(size?: string): void;
    close(): void;
    dismiss(): void;
    private hide();
    private isSmall();
    private isLarge();
}
export declare class ModalSize {
    static Small: string;
    static Large: string;
    static validSize(size: string): boolean;
}
export declare enum ModalResult {
    None = 0,
    Close = 1,
    Dismiss = 2,
}
export declare function uniqueId(prefix: string): string;
