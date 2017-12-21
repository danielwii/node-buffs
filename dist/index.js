"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var ConfigLoader = (function () {
    function ConfigLoader(optionsLoader) {
        if (optionsLoader === void 0) { optionsLoader = {}; }
        this.optionsLoader = optionsLoader;
    }
    ConfigLoader.prototype.loadConfigFromOptions = function (key) {
        return _.isObjectLike(this.optionsLoader)
            ? _.get(this.optionsLoader, key)
            : _.isFunction(this.optionsLoader) ? _.get(this.optionsLoader(), key) : null;
    };
    ConfigLoader.prototype.loadConfig = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        return process.env[key] || this.loadConfigFromOptions(key) || defaultValue;
    };
    ConfigLoader.prototype.loadEncodedConfig = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        var encoded = process.env[key] || this.loadConfigFromOptions(key);
        return encoded ? exports.base64Decode(encoded) : defaultValue;
    };
    return ConfigLoader;
}());
exports.ConfigLoader = ConfigLoader;
exports.base64Decode = function (str) {
    if (str === void 0) { str = ''; }
    return new Buffer(str, 'base64').toString('ascii').trim();
};
exports.base64Encode = function (str) {
    if (str === void 0) { str = ''; }
    return new Buffer(str).toString('base64');
};
exports.loadConfig = function (key, configs, defaultValue) {
    return process.env[key] || configs[key] || defaultValue;
};
exports.loadEncodedConfig = function (key, configs, defaultValue) {
    var value = process.env[key] || configs[key];
    return value ? exports.base64Decode("" + value) : defaultValue;
};
