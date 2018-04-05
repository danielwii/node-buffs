"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var _ = {
    get: require('lodash/get'),
    mapValues: require('lodash/mapValues'),
    isFunction: require('lodash/isFunction'),
    isObjectLike: require('lodash/isObjectLike'),
    isNil: require('lodash/isNil'),
    isEmpty: require('lodash/isEmpty'),
    zipObject: require('lodash/zipObject'),
    assign: require('lodash/assign'),
    filter: require('lodash/filter')
};
/**
 * 采用 base64 解码字符串
 * @param {string} str - 字符串
 * @returns {string}   - 解码后字符串
 */
exports.base64Decode = function (str) {
    if (str === void 0) { str = ''; }
    return new Buffer(str, 'base64').toString('ascii').trim();
};
exports.createConfigLoader = function (opts) {
    return new ConfigLoader(opts);
};
exports.loadDotEnv = function () {
    var suffix = process.env.ENV ? "." + process.env.ENV : '';
    if (!suffix &&
        process.env.NODE_ENV &&
        process.env.NODE_ENV !== 'production') {
        suffix = "." + process.env.NODE_ENV;
    }
    var dotenvResult = dotenv_1.default.config({ path: ".env" + suffix });
    if (dotenvResult.error) {
        console.warn(dotenvResult.error.message);
        return {};
    }
    return dotenvResult.parsed || {}; // load .env into process.env}
};
/**
 *
 * @param key
 * @param options
 * @param defaultValue
 * @returns {any}
 */
exports.loadEncodedConfig = function (key, options, defaultValue) {
    var value = process.env[key] || options[key];
    return value ? exports.base64Decode("" + value) : defaultValue;
};
/**
 * 配置读取器
 */
var ConfigLoader = /** @class */ (function () {
    function ConfigLoader(opts) {
        if (opts === void 0) { opts = {}; }
        this.options = {};
        this.optionsLoader = opts.optionsLoader;
        this.requiredVariables = opts.requiredVariables || [];
        this.options = exports.loadDotEnv();
        this.validate();
    }
    /**
     * load config from env first, then options loader, and default at last.
     * @param {string} key            - property key
     * @param {any=null} defaultValue - default value
     * @returns {any}                 - property value
     */
    ConfigLoader.prototype.loadConfig = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        return (process.env[key] ||
            this.options[key] ||
            this.loadConfigFromOptions(key) ||
            defaultValue);
    };
    ConfigLoader.prototype.loadEncodedConfig = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        var encoded = process.env[key] || this.loadConfigFromOptions(key);
        return encoded ? exports.base64Decode(encoded) : defaultValue;
    };
    ConfigLoader.prototype.loadConfigs = function () {
        var _this = this;
        var configs = _.assign(_.zipObject(this.requiredVariables), this.options);
        return _.mapValues(configs, function (value, key) {
            return _this.loadConfig(key);
        });
    };
    ConfigLoader.prototype.setRequiredVariables = function (requires) {
        this.requiredVariables = requires;
    };
    ConfigLoader.prototype.validate = function () {
        var _this = this;
        var notExists = _.filter(this.requiredVariables, function (key) {
            return _.isNil(_this.loadConfig(key));
        });
        if (!_.isEmpty(notExists)) {
            throw new Error("[ConfigLoader] \"" + notExists + "\" is required.");
        }
    };
    ConfigLoader.prototype.loadConfigFromOptions = function (key) {
        return _.isObjectLike(this.optionsLoader)
            ? _.get(this.optionsLoader, key)
            : _.isFunction(this.optionsLoader)
                ? _.get(this.optionsLoader(), key)
                : null;
    };
    return ConfigLoader;
}());
exports.ConfigLoader = ConfigLoader;
//# sourceMappingURL=configs.js.map