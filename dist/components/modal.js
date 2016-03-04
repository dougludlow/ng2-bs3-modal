"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var ModalComponent = (function () {
    function ModalComponent() {
        this.id = uniqueId('modal_');
        this.result = ModalResult.None;
        this.hiding = false;
        this.overrideSize = null;
        this.animation = true;
        this.onClose = new core_1.EventEmitter();
    }
    ModalComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.$modal = jQuery('#' + this.id);
        this.$modal.appendTo('body').modal({ show: false });
        this.$modal
            .on('hide.bs.modal', function (e) {
            _this.hiding = true;
            if (_this.result === ModalResult.None)
                _this.dismiss();
            _this.result = ModalResult.None;
        })
            .on('hidden.bs.modal', function (e) {
            _this.hiding = false;
            _this.overrideSize = null;
        });
    };
    ModalComponent.prototype.open = function (size) {
        if (ModalSize.validSize(size))
            this.overrideSize = size;
        this.$modal.modal('show');
    };
    ModalComponent.prototype.close = function () {
        this.result = ModalResult.Close;
        this.onClose.next(this.result);
        this.hide();
    };
    ModalComponent.prototype.dismiss = function () {
        this.result = ModalResult.Dismiss;
        this.onClose.next(this.result);
        this.hide();
    };
    ModalComponent.prototype.hide = function () {
        if (!this.hiding)
            this.$modal.modal('hide');
    };
    ModalComponent.prototype.isSmall = function () {
        return this.overrideSize !== ModalSize.Large && this.size === ModalSize.Small || this.overrideSize === ModalSize.Small;
    };
    ModalComponent.prototype.isLarge = function () {
        return this.overrideSize !== ModalSize.Small && this.size === ModalSize.Large || this.overrideSize === ModalSize.Large;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ModalComponent.prototype, "animation", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ModalComponent.prototype, "backdrop", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ModalComponent.prototype, "keyboard", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ModalComponent.prototype, "size", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ModalComponent.prototype, "onClose", void 0);
    ModalComponent = __decorate([
        core_1.Component({
            selector: 'modal',
            template: "\n        <div id=\"{{id}}\" class=\"modal\" [ngClass]=\"{ fade: animation }\" tabindex=\"-1\" role=\"dialog\"\n            [attr.data-keyboard]=\"keyboard\" [attr.data-backdrop]=\"backdrop\">\n            <div class=\"modal-dialog\" [ngClass]=\"{ 'modal-sm': isSmall(), 'modal-lg': isLarge() }\">\n                <div class=\"modal-content\">\n                    <ng-content></ng-content>\n                </div>\n            </div>\n        </div>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], ModalComponent);
    return ModalComponent;
}());
exports.ModalComponent = ModalComponent;
var ModalSize = (function () {
    function ModalSize() {
    }
    ModalSize.validSize = function (size) {
        return size && (size === ModalSize.Small || size === ModalSize.Large);
    };
    ModalSize.Small = 'sm';
    ModalSize.Large = 'lg';
    return ModalSize;
}());
exports.ModalSize = ModalSize;
(function (ModalResult) {
    ModalResult[ModalResult["None"] = 0] = "None";
    ModalResult[ModalResult["Close"] = 1] = "Close";
    ModalResult[ModalResult["Dismiss"] = 2] = "Dismiss";
})(exports.ModalResult || (exports.ModalResult = {}));
var ModalResult = exports.ModalResult;
var id = 0;
function uniqueId(prefix) {
    return prefix + ++id;
}
exports.uniqueId = uniqueId;
//# sourceMappingURL=modal.js.map