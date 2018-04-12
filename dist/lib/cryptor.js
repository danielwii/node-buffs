"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require('crypto');
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
//# sourceMappingURL=cryptor.js.map