import * as dotenv from 'dotenv';
import { resolve } from 'path';

export type Options = {
  [key: string]: string | number | boolean;
};

export type Func = () => any;

export type FOptionsLoader = Options | Func;

export interface ConfigLoaderOpts {
  /**
   * 从 process.env 加载一个 ENV 属性，其值用于识别 .env 的后缀
   * e.g ENV=test will load .env.test
   */
  dotenvBy?: string;
  /**
   * 配置加载器，可以是一个方法或配置对象
   */
  optionsLoader?: FOptionsLoader;
  /**
   * 设置必填字段
   */
  requiredVariables?: string[];
  /**
   * 覆盖配置，优先级最高
   */
  overwriteOptions?: Options;
  /**
   * 配置加载路径
   */
  path?: string;
  /**
   * 自定义后缀
   */
  suffix?: string;
}

const _ = {
  get: require('lodash/get'),
  mapValues: require('lodash/mapValues'),
  zipObject: require('lodash/zipObject'),
  assign: require('lodash/assign'),
  filter: require('lodash/filter'),
  isFunction: require('lodash/isFunction'),
  isObjectLike: require('lodash/isObjectLike'),
  isNil: require('lodash/isNil'),
  isEmpty: require('lodash/isEmpty'),
  isString: require('lodash/isString'),
};

/**
 * 读取配置文件
 * @param {string} by 从 process.env 中读取指定的后缀，default: ENV
 * @param pathStr 访问路径，默认为 `.`，可以从 ENV_PATH 中获取位置
 * @param suffixStr .env 文件后缀
 * @returns {Options}
 */
export function loadDotEnv(by = 'ENV', pathStr = '.', suffixStr = ''): Options {
  const suffix = process.env[by] ?? suffixStr ? `.${process.env[by] ?? suffixStr}` : '';
  const from = process.env.ENV_PATH ?? pathStr;
  const path = resolve(`${from}/.env${suffix}`);
  console.log(`load from ${path}`);
  const dotenvResult = dotenv.config({ path });
  if (dotenvResult.error) {
    console.warn(dotenvResult.error.message);
    return {};
  }
  return dotenvResult.parsed ?? {}; // load .env into process.env}
}

/**
 * 配置读取器，加载优先级：
 * overwrite options -> process.env -> options(.env) -> optionsLoader(user config) -> default
 */
export class ConfigLoader {
  /**
   * 从 process.env 读取要加载的 .env 后缀，default: ENV
   */
  private readonly dotenvBy: string;

  /**
   * 配置加载器，可以是一个方法或配置对象
   */
  private readonly optionsLoader: FOptionsLoader;

  /**
   * 设置必填字段
   */
  private requiredVariables: string[];

  /**
   * 覆盖配置，优先级最高
   */
  private overwriteOptions: Options;

  /**
   * 加载自 .env 的配置
   * @type {{}}
   */
  private options: Options = {};

  constructor(opts: ConfigLoaderOpts = {}) {
    this.dotenvBy = opts.dotenvBy ?? 'ENV';
    this.optionsLoader = opts.optionsLoader ?? {};
    this.overwriteOptions = opts.overwriteOptions ?? {};
    this.requiredVariables = opts.requiredVariables ?? [];
    this.options = loadDotEnv(this.dotenvBy, opts.path, opts.suffix);
    this.validate();
  }

  /**
   * load config from env first, then options loader, and default at last.
   * @param {string} key            - property key
   * @param defaultValue
   * @param convert                 - convert bool string to bool and numeric string to numeric
   * @returns {any}                 - property value
   */
  public loadConfig<T = string>(key: string, defaultValue: any = null, convert = false): T | null {
    const value =
      this.overwriteOptions[key] ??
      process.env[key] ??
      this.options[key] ??
      this.loadConfigFromOptions(key) ??
      defaultValue;

    return convert ? ConfigLoader.convertValue(value) : value;
  }

  public loadNumericConfig(key: string, defaultValue: number | null = null): number | null {
    return this.loadConfig(key, defaultValue, true);
  }

  public loadBoolConfig(key: string, defaultValue: boolean | null = null): boolean | null {
    return this.loadConfig(key, defaultValue, true);
  }

  public loadConfigs(opts: { convert: boolean } = { convert: false }): Options {
    const configs = _.assign(_.zipObject(this.requiredVariables), this.options);
    return _.mapValues(configs, (value: string | number | boolean, key: string) =>
      this.loadConfig(key, null, opts.convert)
    );
  }

  /**
   * 设置必设参数，未找到值时报错
   * @param {string[]} requires
   * @param overwrite 是否覆盖已经设置的值，默认: true
   */
  public setRequiredVariables(requires: string[], overwrite = true): void {
    this.requiredVariables = overwrite ? requires : { ...this.requiredVariables, ...requires };
  }

  public setOverwriteOptions(options: Options, overwrite = true): void {
    this.overwriteOptions = overwrite ? options : { ...this.overwriteOptions, ...options };
  }

  public validate(): void {
    const notExists = _.filter(this.requiredVariables, (key: string) => _.isNil(this.loadConfig(key)));
    if (!_.isEmpty(notExists)) {
      throw new Error(`[ConfigLoader] "${notExists}" is required.`);
    }
  }

  private static convertValue(value: any): any {
    if (/^\d+$/.test(value)) {
      return +value;
    }

    if (_.isString(value) && /^(true|false)$/.test(value)) {
      return value === 'true';
    }
    return value;
  }

  private loadConfigFromOptions(key: string): any {
    if (_.isObjectLike(this.optionsLoader)) {
      return _.get(this.optionsLoader, key);
    }
    return _.isFunction(this.optionsLoader) ? _.get((this.optionsLoader as Func)(), key) : null;
  }
}

export function createConfigLoader(opts: ConfigLoaderOpts): ConfigLoader {
  return new ConfigLoader(opts);
}
