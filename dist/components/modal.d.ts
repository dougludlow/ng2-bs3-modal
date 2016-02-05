import { EventEmitter } from 'angular2/core';
export declare class ModalComponent {
    id: string;
    $modal: JQuery;
    onClose: EventEmitter<string>;
    constructor();
    open(): void;
    close(): void;
    dismiss(): void;
}
export declare function uniqueId(prefix: string): string;
