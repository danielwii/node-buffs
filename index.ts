import * as _ from 'lodash';

import * as crypto from 'crypto';

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

/**
 * 配置读取器
 */
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

/**
 * 加密工具
 */
export class Cryptor {
  private readonly iterations: number;
  private readonly keylen: number;
  private readonly digest: string;

  constructor(iterations: number = 10000, keylen: number = 16, digest: string = 'sha512') {
    this.iterations = iterations;
    this.keylen     = keylen;
    this.digest     = digest;
  }

  static generateSalt(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

  static encrypt(data: string, digest: string = 'sha512') {
    return crypto.createHash(digest).update(data).digest('hex');
  }

  /**
   *
   * @param {string} password
   * @param {string} prefix
   * @returns {{hash: string; salt: string}}
   */
  passwordEncrypt(password: string, prefix: string = '') {
    const salt              = Cryptor.generateSalt();
    const encryptedPassword = Cryptor.encrypt(password);
    const generatedSalt     = `${prefix}${salt}`;
    const hash              = crypto
      .pbkdf2Sync(encryptedPassword, generatedSalt, this.iterations, this.keylen, this.digest)
      .toString('hex')
    ;
    return { hash, salt };
  }

  passwordCompare(password: string, savedHash: string, savedSalt: string, prefix: string = '') {
    const encryptedPassword = Cryptor.encrypt(password);
    const generatedSalt     = `${prefix}${savedSalt}`;
    return savedHash === crypto
      .pbkdf2Sync(encryptedPassword, generatedSalt, this.iterations, this.keylen, this.digest)
      .toString('hex');
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
 * @param options
 * @param defaultValue
 * @returns {any}
 */
export const loadConfig = (key: string, options: JsonMap, defaultValue: any): any => {
  return process.env[key] || options[key] || defaultValue;
};


/**
 *
 * @param key
 * @param options
 * @param defaultValue
 * @returns {any}
 */
export const loadEncodedConfig = (key, options: JsonMap, defaultValue): any => {
  const value = process.env[key] || options[key];
  return value ? base64Decode(`${value}`) : defaultValue;
};
