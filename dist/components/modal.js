var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
require('bootstrap');
var $ = require('jquery');
var core_1 = require('angular2/core');
var ModalComponent = (function () {
    function ModalComponent() {
        this.id = uniqueId('modal_');
        this.onClose = new core_1.EventEmitter();
        this.$modal = $('#' + this.id);
        this.$modal.appendTo('body').modal({ show: false });
        this.$modal.on('hide.bs.modal', function (e) {
            console.log(e);
        });
    }
    ModalComponent.prototype.open = function () {
        this.$modal.modal('show');
    };
    ModalComponent.prototype.close = function () {
        this.$modal.modal('hide');
        this.onClose.next('close');
    };
    ModalComponent.prototype.dismiss = function () {
        this.$modal.modal('hide');
        this.onClose.next('dismiss');
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ModalComponent.prototype, "onClose", void 0);
    ModalComponent = __decorate([
        core_1.Component({
            selector: 'modal',
            template: "\n        <div id=\"{{id}}\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\">\n            <div class=\"modal-dialog\">\n                <div class=\"modal-content\">\n                    <ng-content></ng-content>\n                </div>\n            </div>\n        </div>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], ModalComponent);
    return ModalComponent;
})();
exports.ModalComponent = ModalComponent;
var id = 0;
function uniqueId(prefix) {
    return prefix + ++id;
}
exports.uniqueId = uniqueId;
//# sourceMappingURL=modal.js.map