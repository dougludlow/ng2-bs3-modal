export class BsModalSize {
    static Small = 'sm';
    static Large = 'lg';

    static isValidSize(size: string) {
        return size && (size === BsModalSize.Small || size === BsModalSize.Large);
    }
}
