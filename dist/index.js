"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var fs_1 = require("fs");
var TelegramService = /** @class */ (function () {
    function TelegramService() {
    }
    TelegramService.sendMessage = function (message, chatType) {
        if (chatType === void 0) { chatType = 'main'; }
        return __awaiter(this, void 0, void 0, function () {
            var chatId, project;
            return __generator(this, function (_a) {
                if (!this.channels) {
                    this.setConfiguration();
                }
                chatId = this.channels[chatType];
                if (!this.isProduction) {
                    chatId = this.channels.development;
                }
                if (message instanceof Error) {
                    message = this.parseError(message);
                }
                project = this.projectName;
                if (!this.isProduction) {
                    project = 'dev';
                }
                axios_1.default.post("" + this.telegramApiUrl + this.botToken + "/" + project, {
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                });
                return [2 /*return*/];
            });
        });
    };
    TelegramService.setConfiguration = function () {
        var config = JSON.parse(fs_1.readFileSync('./config.json'));
        var loggerConfig = config.logger;
        if (!loggerConfig) {
            throw new Error('logger field in config.json not found.');
        }
        if (!loggerConfig.botToken || !loggerConfig.telegramApiUrl) {
            throw new Error('logger.botToken or logger.telegramApiUrl field in config.json not found.');
        }
        if (!loggerConfig.channels || !(loggerConfig === null || loggerConfig === void 0 ? void 0 : loggerConfig.channels.development) || !(loggerConfig === null || loggerConfig === void 0 ? void 0 : loggerConfig.channels.main)) {
            throw new Error('logger.channels.development or channels.development.main field in config.json not found.');
        }
        this.botToken = loggerConfig.botToken;
        this.telegramApiUrl = loggerConfig.telegramApiUrl;
        this.projectName = loggerConfig.projectName || this.projectName;
        this.channels = loggerConfig.channels;
    };
    TelegramService.parseError = function (exception) {
        var exceptionTrace = exception.stack || '';
        var exceptionMessage = exception.message || '';
        var exceptionType = exception.name || '';
        var exceptionToString = exception.toString();
        return "<b>ExceptionType</b>: " + this.stripTags(exceptionType) + "\n<b>ExceptionMessage</b>: " + this.stripTags(exceptionMessage) + "\n<b>ExceptionTrace</b>: " + this.stripTags(exceptionTrace) + "\n<b>ExceptionToString</b>: " + this.stripTags(exceptionToString);
    };
    TelegramService.stripTags = function (text) {
        if (typeof text === 'string') {
            return text.replace(/(<([^>]+)>)/gi, '');
        }
        return text;
    };
    TelegramService.isProduction = process.env.ENV === 'prod';
    TelegramService.projectName = 'dev';
    return TelegramService;
}());
exports.default = TelegramService;
