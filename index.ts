import * as _ from 'lodash';

// --------------------------------------------------------------
// Define Types
// --------------------------------------------------------------

export interface JsonMap {
  [member: string]: string | number | boolean | null | JsonArray | JsonMap;
}

export interface JsonArray extends Array<string | number | boolean | null | JsonArray | JsonMap> {
}

export type Json = JsonMap | JsonArray | string | number | boolean | null;

// --------------------------------------------------------------
// Core Classes
// --------------------------------------------------------------

export class ConfigLoader {
  private optionsLoader: object | { (): object };

  constructor(optionsLoader = {}) {
    this.optionsLoader = optionsLoader;
  }

  private loadConfigFromOptions(key: string): any {
    return _.isObjectLike(this.optionsLoader)
      ? _.get(this.optionsLoader, key)
      : _.isFunction(this.optionsLoader) ? _.get(this.optionsLoader(), key) : null;
  }

  /**
   * load config from env first, then options loader, and default at last.
   * @param {string} key            - property key
   * @param {any=null} defaultValue - default value
   * @returns {any}                 - property value
   */
  loadConfig(key: string, defaultValue: any = null): any {
    return process.env[key] || this.loadConfigFromOptions(key) || defaultValue;
  }

  loadEncodedConfig(key: string, defaultValue: any = null): any {
    const encoded = process.env[key] || this.loadConfigFromOptions(key);
    return encoded ? base64Decode(encoded) : defaultValue;
  }
}

// --------------------------------------------------------------
// Core Functions
// --------------------------------------------------------------

/**
 * 采用 base64 解码字符串
 * @param {string} str - 字符串
 * @returns {string}   - 解码后字符串
 */
export const base64Decode =
  (str: string = ''): string => {
    return new Buffer(str, 'base64').toString('ascii').trim();
  };

/**
 *
 * @param {string} str
 * @returns {string}
 */
export const base64Encode = (str: string = ''): string => {
  return new Buffer(str).toString('base64');
};

/**
 *
 * @param {string} key
 * @param configs
 * @param defaultValue
 * @returns {any}
 */
export const loadConfig = (key: string, configs: JsonMap, defaultValue: any): any => {
  return process.env[key] || configs[key] || defaultValue;
};


/**
 *
 * @param key
 * @param configs
 * @param defaultValue
 * @returns {any}
 */
export const loadEncodedConfig = (key, configs: JsonMap, defaultValue): any => {
  const value = process.env[key] || configs[key];
  return value ? base64Decode(`${value}`) : defaultValue;
};
