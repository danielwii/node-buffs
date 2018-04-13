import dotenv from 'dotenv';
import { Func, Json, JsonMap } from './typings';

export type FOptionsLoader = Json | Func;

const _ = {
  get: require('lodash/get'),
  mapValues: require('lodash/mapValues'),
  zipObject: require('lodash/zipObject'),
  assign: require('lodash/assign'),
  filter: require('lodash/filter'),
  isFunction: require('lodash/isFunction'),
  isObjectLike: require('lodash/isObjectLike'),
  isNil: require('lodash/isNil'),
  isEmpty: require('lodash/isEmpty')
};

/**
 * 采用 base64 解码字符串
 * @param {string} str - 字符串
 * @returns {string}   - 解码后字符串
 */
export function base64Decode(str: string = ''): string {
  return new Buffer(str, 'base64').toString('ascii').trim();
}

export function createConfigLoader(opts: {
  optionsLoader?: FOptionsLoader;
  requiredVariables?: string[];
}): ConfigLoader {
  return new ConfigLoader(opts);
}

export function loadDotEnv(): JsonMap {
  const suffix = process.env.ENV ? `.${process.env.ENV}` : '';
  const dotenvResult = dotenv.config({ path: `.env${suffix}` });
  if (dotenvResult.error) {
    console.warn(dotenvResult.error.message);
    return {};
  }
  return dotenvResult.parsed || {}; // load .env into process.env}
}

/**
 *
 * @param key
 * @param options
 * @param defaultValue
 * @returns {any}
 */
export function loadEncodedConfig(
  key: string,
  options: JsonMap,
  defaultValue: any
): any {
  const value = process.env[key] || options[key];
  return value ? base64Decode(`${value}`) : defaultValue;
}

/**
 * 配置读取器
 * 配置加载优先级：
 *   overwrite options -> process.env -> options(.env) -> optionsLoader(user config) -> default
 */
export class ConfigLoader {
  private optionsLoader: any;
  private requiredVariables: string[];
  private overwriteOptions: JsonMap;
  private options: JsonMap = {};

  constructor(
    opts: {
      optionsLoader?: FOptionsLoader;
      requiredVariables?: string[];
      overwriteOptions?: JsonMap;
    } = {}
  ) {
    this.optionsLoader = opts.optionsLoader;
    this.overwriteOptions = opts.overwriteOptions || {};
    this.requiredVariables = opts.requiredVariables || [];
    this.options = loadDotEnv();
    this.validate();
  }

  /**
   * load config from env first, then options loader, and default at last.
   * @param {string} key            - property key
   * @param {any=null} defaultValue - default value
   * @returns {any}                 - property value
   */
  public loadConfig(key: string, defaultValue: any = null): any {
    const value =
      this.overwriteOptions[key] ||
      process.env[key] ||
      this.options[key] ||
      this.loadConfigFromOptions(key) ||
      defaultValue;
    if (/\d+/.test(value)) {
      return +value;
    }
    if (/(true|false)/.test(value)) {
      return value === 'true';
    }
    return value;
  }

  /**
   * 读取 base64 编码的配置
   * @param {string} key
   * @param defaultValue
   * @returns {any}
   */
  public loadEncodedConfig(key: string, defaultValue: any = null): any {
    const encoded = process.env[key] || this.loadConfigFromOptions(key);
    return encoded ? base64Decode(encoded) : defaultValue;
  }

  public loadConfigs(): Json {
    const configs = _.assign(_.zipObject(this.requiredVariables), this.options);
    return _.mapValues(configs, (value: Json, key: string) =>
      this.loadConfig(key)
    );
  }

  /**
   * 设置必设参数，未找到值时报错
   * @param {string[]} requires
   */
  public setRequiredVariables(requires: string[]): void {
    this.requiredVariables = requires;
  }

  public setOverwriteOptions(options: JsonMap): void {
    this.overwriteOptions = { ...this.overwriteOptions, ...options };
  }

  public validate(): void {
    const notExists = _.filter(this.requiredVariables, (key: string) =>
      _.isNil(this.loadConfig(key))
    );
    if (!_.isEmpty(notExists)) {
      throw new Error(`[ConfigLoader] "${notExists}" is required.`);
    }
  }

  private loadConfigFromOptions(key: string): any {
    return _.isObjectLike(this.optionsLoader)
      ? _.get(this.optionsLoader, key)
      : _.isFunction(this.optionsLoader)
        ? _.get(this.optionsLoader(), key)
        : null;
  }
}
