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
var modal_1 = require('./modal');
var ModalBodyComponent = (function () {
    function ModalBodyComponent(modal) {
        this.modal = modal;
    }
    ModalBodyComponent = __decorate([
        core_1.Component({
            selector: 'modal-body',
            template: "\n        <div class=\"modal-body\">\n            <ng-content></ng-content>\n        </div>\n    "
        }), 
        __metadata('design:paramtypes', [modal_1.ModalComponent])
    ], ModalBodyComponent);
    return ModalBodyComponent;
}());
exports.ModalBodyComponent = ModalBodyComponent;
//# sourceMappingURL=modal-body.js.map