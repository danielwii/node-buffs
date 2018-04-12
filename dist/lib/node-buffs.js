"use strict";
// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var _ = {
    mapValues: require('lodash/mapValues')
};
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
// --------------------------------------------------------------
// Core Functions
// --------------------------------------------------------------
/**
 *
 * @param {string} str
 * @returns {string}
 */
exports.base64Encode = function (str) {
    if (str === void 0) { str = ''; }
    return new Buffer(str).toString('base64');
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
__export(require("./configs"));
__export(require("./cryptor"));
__export(require("./strings"));
//# sourceMappingURL=node-buffs.js.map