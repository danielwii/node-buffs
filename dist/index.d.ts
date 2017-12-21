export declare class ConfigLoader {
    private optionsLoader;
    constructor(optionsLoader: any);
    private loadConfigFromOptions(key);
    private static base64Decode(str?);
    loadConfig(key: string, defaultValue?: any): any;
    loadEncodedConfig(key: string, defaultValue?: any): any;
}
export declare const loadConfig: (key: string, options: {
    [name: string]: any;
}, defaultValue: any) => any;
export declare const loadEncodedConfig: (key: any, options: {
    [name: string]: any;
}, defaultValue: any) => any;
