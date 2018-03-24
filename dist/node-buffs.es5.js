import { randomBytes, createHash, pbkdf2Sync } from 'crypto';

// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
var _ = {
    get: require('lodash/get'),
    mapValues: require('lodash/mapValues'),
    isFunction: require('lodash/isFunction'),
    isObjectLike: require('lodash/isObjectLike'),
    isUndefined: require('lodash/isUndefined'),
    isNil: require('lodash/isNil'),
    isEmpty: require('lodash/isEmpty'),
    has: require('lodash/has'),
    filter: require('lodash/filter'),
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
var createConfigLoader = function (options) {
    return new ConfigLoader(options);
};
/**
 * 配置读取器
 */
var ConfigLoader = /** @class */ (function () {
    function ConfigLoader(options) {
        if (options === void 0) { options = {}; }
        this.optionsLoader = options.optionsLoader;
        this.requiredVariables = options.requiredVariables || [];
        loadDotEnv();
    }
    /**
     * load config from env first, then options loader, and default at last.
     * @param {string} key            - property key
     * @param {any=null} defaultValue - default value
     * @returns {any}                 - property value
     */
    ConfigLoader.prototype.loadConfig = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        return process.env[key] || this.loadConfigFromOptions(key) || defaultValue;
    };
    ConfigLoader.prototype.loadEncodedConfig = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        var encoded = process.env[key] || this.loadConfigFromOptions(key);
        return encoded ? base64Decode(encoded) : defaultValue;
    };
    ConfigLoader.prototype.setRequiredVariables = function (requires) {
        this.requiredVariables = requires;
    };
    ConfigLoader.prototype.validate = function () {
        var _this = this;
        var notExists = _.filter(this.requiredVariables, function (key) { return _.isNil(_this.loadConfig(key)); });
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
        return randomBytes(length)
            .toString('hex')
            .slice(0, length);
    };
    Cryptor.encrypt = function (data, digest) {
        if (digest === void 0) { digest = 'sha512'; }
        return createHash(digest)
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
        var hash = pbkdf2Sync(encryptedPassword, generatedSalt, this.iterations, this.keylen, this.digest)
            .toString('hex');
        return { hash: hash, salt: salt };
    };
    Cryptor.prototype.passwordCompare = function (password, savedHash, savedSalt, prefix) {
        if (prefix === void 0) { prefix = ''; }
        var encryptedPassword = Cryptor.encrypt(password);
        var generatedSalt = "" + prefix + savedSalt;
        return (savedHash ===
            pbkdf2Sync(encryptedPassword, generatedSalt, this.iterations, this.keylen, this.digest)
                .toString('hex'));
    };
    return Cryptor;
}());
// --------------------------------------------------------------
// Core Functions
// --------------------------------------------------------------
/**
 * 采用 base64 解码字符串
 * @param {string} str - 字符串
 * @returns {string}   - 解码后字符串
 */
var base64Decode = function (str) {
    if (str === void 0) { str = ''; }
    return new Buffer(str, 'base64').toString('ascii').trim();
};
/**
 *
 * @param {string} str
 * @returns {string}
 */
var base64Encode = function (str) {
    if (str === void 0) { str = ''; }
    return new Buffer(str).toString('base64');
};
var loadDotEnv = function () {
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
 * @param {string} key
 * @param options
 * @param defaultValue
 * @returns {any}
 */
var loadConfig = function (key, options, defaultValue) {
    return process.env[key] || options[key] || defaultValue;
};
/**
 *
 * @param key
 * @param options
 * @param defaultValue
 * @returns {any}
 */
var loadEncodedConfig = function (key, options, defaultValue) {
    var value = process.env[key] || options[key];
    return value ? base64Decode("" + value) : defaultValue;
};
var reduxAction = function (type, payload, error) {
    if (payload === void 0) { payload = {}; }
    if (error === void 0) { error = null; }
    return ({
        type: type,
        payload: payload,
        error: error
    });
};

export { AbstractReduxModuleWithSage, createConfigLoader, ConfigLoader, Cryptor, base64Decode, base64Encode, loadDotEnv, loadConfig, loadEncodedConfig, reduxAction };
