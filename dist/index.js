"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var ConfigLoader = (function () {
    function ConfigLoader(optionsLoader) {
        this.optionsLoader = optionsLoader;
    }
    ConfigLoader.prototype.loadConfigFromOptions = function (key) {
        return _.isObject(this.optionsLoader)
            ? _.get(this.optionsLoader, key)
            : _.isFunction(this.optionsLoader) ? _.get(this.optionsLoader(), key) : null;
    };
    ConfigLoader.base64Decode = function (str) {
        if (str === void 0) { str = ''; }
        return new Buffer(str, 'base64').toString('ascii').trim();
    };
    ConfigLoader.prototype.loadConfig = function (key, defaultValue) {
        return process.env[key] || this.loadConfigFromOptions(key) || defaultValue;
    };
    ConfigLoader.prototype.loadEncodedConfig = function (key, defaultValue) {
        var encoded = process.env[key] || this.loadConfigFromOptions(key);
        return encoded ? ConfigLoader.base64Decode(encoded) : defaultValue;
    };
    return ConfigLoader;
}());
exports.ConfigLoader = ConfigLoader;
exports.loadConfig = function (key, options, defaultValue) {
    return process.env[key] || options[key] || defaultValue;
};
exports.loadEncodedConfig = function (key, options, defaultValue) {
    var value = process.env[key] || options[key];
    if (value) {
        return new Buffer(value, 'base64').toString('ascii').trim();
    }
    return defaultValue;
};
