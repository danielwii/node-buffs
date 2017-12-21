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
export declare const base64Decode: (str?: string) => string;
export declare const base64Encode: (str?: string) => string;
export declare const loadConfig: (key: string, configs: JsonMap, defaultValue: any) => any;
export declare const loadEncodedConfig: (key: any, configs: JsonMap, defaultValue: any) => any;
