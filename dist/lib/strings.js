"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = {
    isString: require('lodash/isString')
};
/**
 * cast camel case to snake case
 * @param {string} str
 * @returns {string}
 */
exports.toSnakeCase = function (str) {
    if (_.isString(str) && str.length > 1) {
        var trimStr = str.trim();
        return (trimStr[0].toLowerCase() +
            trimStr.slice(1).replace(/[A-Z]/g, function (match) { return '_' + match.toLowerCase(); }));
    }
    return str;
};
/**
 * cast snake case to camel case
 * @param {string} str
 * @returns {string}
 */
exports.toCamelCase = function (str) {
    if (_.isString(str) && str.includes('_') && str.length > 1) {
        var trimStr = str.trim();
        var strings = trimStr.split('_');
        return (strings[0] +
            strings
                .slice(1)
                .map(function (s) { return s[0].toUpperCase() + s.slice(1); })
                .join(''));
    }
    return str;
};
//# sourceMappingURL=strings.js.map