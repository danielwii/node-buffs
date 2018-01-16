import { DotenvResult } from 'dotenv';
export interface JsonMap {
    [member: string]: string | number | boolean | null | JsonArray | JsonMap;
}
export interface JsonArray extends Array<string | number | boolean | null | JsonArray | JsonMap> {
}
export declare type Json = JsonMap | JsonArray | string | number | boolean | null;
export declare abstract class AbstractReduxModuleWithSage {
    private moduleName;
    constructor(moduleName?: string);
    abstract actionTypes(): JsonMap;
    abstract actions(): JsonMap;
    abstract sagas(): any[];
    abstract initialState(): JsonMap;
    abstract reducer(): JsonMap;
    protected actionTypesWrapper(): any;
    exports(): {
        actionTypes: any;
        actions: JsonMap;
        sagas: any[];
        reducer: JsonMap;
    };
}
export declare const createConfigLoader: (optionsLoader?: any) => ConfigLoader;
export declare class ConfigLoader {
    private optionsLoader;
    constructor(optionsLoader?: any);
    private loadConfigFromOptions(key);
    loadConfig(key: string, defaultValue?: any): any;
    loadEncodedConfig(key: string, defaultValue?: any): any;
}
export declare class Cryptor {
    private readonly iterations;
    private readonly keylen;
    private readonly digest;
    constructor(iterations?: number, keylen?: number, digest?: string);
    static generateSalt(length?: number): string;
    static encrypt(data: string, digest?: string): string;
    passwordEncrypt(password: string, prefix?: string): {
        hash: string;
        salt: string;
    };
    passwordCompare(password: string, savedHash: string, savedSalt: string, prefix?: string): boolean;
}
export declare const base64Decode: (str?: string) => string;
export declare const base64Encode: (str?: string) => string;
export declare const loadDotEnv: () => DotenvResult;
export declare const loadConfig: (key: string, options: JsonMap, defaultValue: any) => any;
export declare const loadEncodedConfig: (key: any, options: JsonMap, defaultValue: any) => any;
export declare const reduxAction: (type: any, payload?: {}, error?: any) => {
    type: any;
    payload: {};
    error: any;
};
