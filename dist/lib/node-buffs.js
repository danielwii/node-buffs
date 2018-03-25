"use strict";
// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
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
var dotenv = require('dotenv');
// --------------------------------------------------------------
// Core Classes
// --------------------------------------------------------------
/**
 * @example
 * class ModuleNotifications extends AbstractReduxModuleWithSage {
 *   // set module name first
 *   constructor() {
 *     super('notifications');
 *   }
 *
 *   actionTypes() {
 *     return {
 *       NOTIFY: 'notify',
 *     };
 *   }
 *
 *   actions() {
 *     return {
 *       notify: message => dispatch =>
 *         dispatch({ type: this.actionTypesWrapper().NOTIFY, payload: { message } }),
 *     };
 *   }
 *
 *   sagas() {
 *     return [];
 *   }
 *
 *   initialState() {
 *     return { notifications: [] };
 *   }
 *
 *   reducer() {
 *     return (previousState = this.initialState(), action) => {
 *       const state = previousState || this.initialState();
 *       switch (action.type) {
 *         default:
 *           return { ...state, ...action.payload };
 *       }
 *     };
 *   }
 * }
 *
 * export default new ModuleNotifications().exports();
 */
var AbstractReduxModuleWithSage = /** @class */ (function () {
    function AbstractReduxModuleWithSage(moduleName) {
        if (moduleName === void 0) { moduleName = 'root'; }
        this.moduleName = moduleName;
    }
    AbstractReduxModuleWithSage.prototype.exports = function () {
        return {
            actionTypes: this.actionTypesWrapper(),
            actions: this.actions(),
            sagas: this.sagas(),
            reducer: this.reducer()
        };
    };
    AbstractReduxModuleWithSage.prototype.actionTypesWrapper = function () {
        var _this = this;
        return _.mapValues(this.actionTypes(), function (value) { return _this.moduleName + "::" + value; });
    };
    return AbstractReduxModuleWithSage;
}());
exports.AbstractReduxModuleWithSage = AbstractReduxModuleWithSage;
exports.createConfigLoader = function (opts) {
    return new ConfigLoader(opts);
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
        return process.env[key] ||
            this.options[key] ||
            this.loadConfigFromOptions(key) ||
            defaultValue;
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
/**
 * 加密工具
 */
var Cryptor = /** @class */ (function () {
    function Cryptor(iterations, keylen, digest) {
        if (iterations === void 0) { iterations = 10000; }
        if (keylen === void 0) { keylen = 16; }
        if (digest === void 0) { digest = 'sha512'; }
        this.iterations = iterations;
        this.keylen = keylen;
        this.digest = digest;
    }
    Cryptor.generateSalt = function (length) {
        if (length === void 0) { length = 32; }
        return crypto
            .randomBytes(length)
            .toString('hex')
            .slice(0, length);
    };
    Cryptor.encrypt = function (data, digest) {
        if (digest === void 0) { digest = 'sha512'; }
        return crypto
            .createHash(digest)
            .update(data)
            .digest('hex');
    };
    /**
     * @param {string} password
     * @param {string} prefix
     * @returns {{hash: string; salt: string}}
     */
    Cryptor.prototype.passwordEncrypt = function (password, prefix) {
        if (prefix === void 0) { prefix = ''; }
        var salt = Cryptor.generateSalt();
        var encryptedPassword = Cryptor.encrypt(password);
        var generatedSalt = "" + prefix + salt;
        var hash = crypto
            .pbkdf2Sync(encryptedPassword, generatedSalt, this.iterations, this.keylen, this.digest)
            .toString('hex');
        return { hash: hash, salt: salt };
    };
    Cryptor.prototype.passwordCompare = function (password, savedHash, savedSalt, prefix) {
        if (prefix === void 0) { prefix = ''; }
        var encryptedPassword = Cryptor.encrypt(password);
        var generatedSalt = "" + prefix + savedSalt;
        return (savedHash ===
            crypto
                .pbkdf2Sync(encryptedPassword, generatedSalt, this.iterations, this.keylen, this.digest)
                .toString('hex'));
    };
    return Cryptor;
}());
exports.Cryptor = Cryptor;
// --------------------------------------------------------------
// Core Functions
// --------------------------------------------------------------
/**
 * 采用 base64 解码字符串
 * @param {string} str - 字符串
 * @returns {string}   - 解码后字符串
 */
exports.base64Decode = function (str) {
    if (str === void 0) { str = ''; }
    return new Buffer(str, 'base64').toString('ascii').trim();
};
/**
 *
 * @param {string} str
 * @returns {string}
 */
exports.base64Encode = function (str) {
    if (str === void 0) { str = ''; }
    return new Buffer(str).toString('base64');
};
exports.loadDotEnv = function () {
    var suffix = process.env.ENV ? "." + process.env.ENV : '';
    if (!suffix &&
        process.env.NODE_ENV &&
        process.env.NODE_ENV !== 'production') {
        suffix = "." + process.env.NODE_ENV;
    }
    var dotenvResult = dotenv.config({ path: ".env" + suffix });
    if (dotenvResult.error) {
        console.warn(dotenvResult.error.message);
        return {};
    }
    return dotenvResult.parsed; // load .env into process.env}
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
exports.reduxAction = function (type, payload, error) {
    if (payload === void 0) { payload = {}; }
    if (error === void 0) { error = null; }
    return ({
        type: type,
        payload: payload,
        error: error
    });
};
//# sourceMappingURL=node-buffs.js.map