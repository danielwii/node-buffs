export interface JsonMap {
    [member: string]: string | number | boolean | null | JsonArray | JsonMap;
}
export interface JsonArray extends Array<string | number | boolean | null | JsonArray | JsonMap> {
}
export declare type Json = JsonMap | JsonArray | string | number | boolean | null;
export declare class ConfigLoader {
    private optionsLoader;
    constructor(optionsLoader?: {});
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
export declare const loadConfig: (key: string, options: JsonMap, defaultValue: any) => any;
export declare const loadEncodedConfig: (key: any, options: JsonMap, defaultValue: any) => any;
