"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var _ = {
    get: require('lodash/get'),
    mapValues: require('lodash/mapValues'),
    isFunction: require('lodash/isFunction'),
    isObjectLike: require('lodash/isObjectLike'),
};
var dotenv = require('dotenv');
var AbstractReduxModuleWithSage = (function () {
    function AbstractReduxModuleWithSage(moduleName) {
        if (moduleName === void 0) { moduleName = 'root'; }
        this.moduleName = moduleName;
    }
    AbstractReduxModuleWithSage.prototype.actionTypesWrapper = function () {
        var _this = this;
        return _.mapValues(this.actionTypes(), function (value) { return _this.moduleName + "::" + value; });
    };
    AbstractReduxModuleWithSage.prototype.exports = function () {
        return {
            actionTypes: this.actionTypesWrapper(),
            actions: this.actions(),
            sagas: this.sagas(),
            reducer: this.reducer(),
        };
    };
    return AbstractReduxModuleWithSage;
}());
exports.AbstractReduxModuleWithSage = AbstractReduxModuleWithSage;
exports.createConfigLoader = function (optionsLoader) {
    return new ConfigLoader(optionsLoader);
};
var ConfigLoader = (function () {
    function ConfigLoader(optionsLoader) {
        this.optionsLoader = optionsLoader;
        exports.loadDotEnv();
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
var Cryptor = (function () {
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
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    };
    Cryptor.encrypt = function (data, digest) {
        if (digest === void 0) { digest = 'sha512'; }
        return crypto.createHash(digest).update(data).digest('hex');
    };
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
        return savedHash === crypto
            .pbkdf2Sync(encryptedPassword, generatedSalt, this.iterations, this.keylen, this.digest)
            .toString('hex');
    };
    return Cryptor;
}());
exports.Cryptor = Cryptor;
exports.base64Decode = function (str) {
    if (str === void 0) { str = ''; }
    return new Buffer(str, 'base64').toString('ascii').trim();
};
exports.base64Encode = function (str) {
    if (str === void 0) { str = ''; }
    return new Buffer(str).toString('base64');
};
exports.loadDotEnv = function () {
    var suffix = '';
    if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
        suffix = "." + process.env.NODE_ENV;
    }
    return dotenv.config({ path: ".env" + suffix });
};
exports.loadConfig = function (key, options, defaultValue) {
    return process.env[key] || options[key] || defaultValue;
};
exports.loadEncodedConfig = function (key, options, defaultValue) {
    var value = process.env[key] || options[key];
    return value ? exports.base64Decode("" + value) : defaultValue;
};
exports.reduxAction = function (type, payload, error) {
    if (payload === void 0) { payload = {}; }
    if (error === void 0) { error = null; }
    return ({ type: type, payload: payload, error: error });
};
