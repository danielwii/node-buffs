export interface JsonMap {
    [member: string]: string | number | boolean | null | JsonArray | JsonMap;
}
export interface JsonArray extends Array<string | number | boolean | null | JsonArray | JsonMap> {
}
export declare type Json = JsonMap | JsonArray | string | number | boolean | null;
export declare type FOptionsLoader = () => any;
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
export declare const createConfigLoader: (optionsLoader?: FOptionsLoader | undefined) => ConfigLoader;
/**
 * 配置读取器
 */
export declare class ConfigLoader {
    private optionsLoader;
    constructor(optionsLoader?: FOptionsLoader);
    /**
     * load config from env first, then options loader, and default at last.
     * @param {string} key            - property key
     * @param {any=null} defaultValue - default value
     * @returns {any}                 - property value
     */
    loadConfig(key: string, defaultValue?: any): any;
    loadEncodedConfig(key: string, defaultValue?: any): any;
    private loadConfigFromOptions(key);
}
/**
 * 加密工具
 */
export declare class Cryptor {
    private readonly iterations;
    private readonly keylen;
    private readonly digest;
    constructor(iterations?: number, keylen?: number, digest?: string);
    static generateSalt(length?: number): string;
    static encrypt(data: string, digest?: string): string;
    /**
     *
     * @param {string} password
     * @param {string} prefix
     * @returns {{hash: string; salt: string}}
     */
    passwordEncrypt(password: string, prefix?: string): {
        hash: string;
        salt: string;
    };
    passwordCompare(password: string, savedHash: string, savedSalt: string, prefix?: string): boolean;
}
/**
 * 采用 base64 解码字符串
 * @param {string} str - 字符串
 * @returns {string}   - 解码后字符串
 */
export declare const base64Decode: (str?: string) => string;
/**
 *
 * @param {string} str
 * @returns {string}
 */
export declare const base64Encode: (str?: string) => string;
export declare const loadDotEnv: () => any;
/**
 *
 * @param {string} key
 * @param options
 * @param defaultValue
 * @returns {any}
 */
export declare const loadConfig: (key: string, options: JsonMap, defaultValue: any) => any;
/**
 *
 * @param key
 * @param options
 * @param defaultValue
 * @returns {any}
 */
export declare const loadEncodedConfig: (key: string, options: JsonMap, defaultValue: any) => any;
export declare const reduxAction: (type: string, payload?: {}, error?: null) => {
    type: string;
    payload: {};
    error: null;
};
