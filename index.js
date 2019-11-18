"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var io = require("socket.io-client");
var events_1 = require("events");
var protocol_1 = require("rsf-telegram-bot/protocol");
// this key will be also used by other classes that implement the "Contactable"
// trait/contract
var STANDARD_EVENT_KEY = 'msg';
exports.STANDARD_EVENT_KEY = STANDARD_EVENT_KEY;
// export a var which will be used to determine whether to use Mattermostable
// as their mode of contact
var TYPE_KEY = 'telegram';
exports.TYPE_KEY = TYPE_KEY;
var socket;
var eventBus;
var init = function (telegramConfig) { return __awaiter(void 0, void 0, void 0, function () {
    var socketUrl, socketSecret;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                socketUrl = telegramConfig.socketUrl, socketSecret = telegramConfig.socketSecret;
                console.log('initializing rsf-telegramable');
                // a singleton that will act to transmit events between the webhook listener
                // and the instances of Telegramable
                eventBus = new events_1.EventEmitter();
                socket = io(socketUrl);
                socket.on(protocol_1.RECEIVE_MESSAGE, function (telegramMessage) {
                    eventBus.emit(telegramMessage.username, telegramMessage.message);
                });
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        socket.on('connect', resolve);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.init = init;
var shutdown = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log('shutting down rsf-telegramable');
        socket.disconnect();
        socket.removeAllListeners();
        eventBus.removeAllListeners();
        socket = null;
        eventBus = null;
        return [2 /*return*/];
    });
}); };
exports.shutdown = shutdown;
var Telegramable = /** @class */ (function (_super) {
    __extends(Telegramable, _super);
    function Telegramable(id, name) {
        var _this = _super.call(this) || this;
        if (!(socket && eventBus)) {
            throw new Error('init has not been called');
        }
        // username
        _this.id = id;
        // a human name, optional
        _this.name = name;
        // forward messages from the event bus over the class/instance level event emitter
        eventBus.on(_this.id, function (text) {
            // emit an event that conforms to the standard for Contactable
            _this.emit(STANDARD_EVENT_KEY, text);
        });
        return _this;
    }
    // expose a function that conforms to the standard for Contactable
    // which can "reach" the person
    Telegramable.prototype.speak = function (message) {
        var telegramMessage = {
            username: this.id,
            message: message
        };
        return new Promise(function (resolve, reject) {
            socket.emit(protocol_1.SEND_MESSAGE, telegramMessage, function (status) {
                if (status === 'success')
                    resolve();
                else if (status === 'error')
                    reject();
            });
        });
    };
    Telegramable.prototype.listen = function (callback) {
        // just set up the actual event listener
        // using the appropriate key,
        // but not bothering to expose it
        this.on(STANDARD_EVENT_KEY, callback);
    };
    Telegramable.prototype.stopListening = function () {
        this.removeAllListeners();
    };
    return Telegramable;
}(events_1.EventEmitter));
exports.Telegramable = Telegramable;
