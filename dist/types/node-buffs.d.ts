import { JsonMap } from './typings';
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
export declare abstract class AbstractReduxModuleWithSage {
    private moduleName;
    constructor(moduleName?: string);
    exports(): {
        actionTypes: any;
        actions: JsonMap;
        sagas: any[];
        reducer: JsonMap;
    };
    abstract actionTypes(): JsonMap;
    abstract actions(): JsonMap;
    abstract sagas(): any[];
    abstract initialState(): JsonMap;
    abstract reducer(): JsonMap;
    protected actionTypesWrapper(): any;
}
/**
 *
 * @param {string} str
 * @returns {string}
 */
export declare const base64Encode: (str?: string) => string;
export declare const reduxAction: (type: string, payload?: {}, error?: null) => {
    type: string;
    payload: {};
    error: null;
};
export * from './configs';
export * from './cryptor';
export * from './strings';
