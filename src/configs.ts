import dotenv from 'dotenv'
import { FOptionsLoader, Json, JsonMap, JsonArray } from './typings'

const _ = {
  get: require('lodash/get'),
  mapValues: require('lodash/mapValues'),
  isFunction: require('lodash/isFunction'),
  isObjectLike: require('lodash/isObjectLike'),
  isNil: require('lodash/isNil'),
  isEmpty: require('lodash/isEmpty'),
  zipObject: require('lodash/zipObject'),
  assign: require('lodash/assign'),
  filter: require('lodash/filter')
}

/**
 * 采用 base64 解码字符串
 * @param {string} str - 字符串
 * @returns {string}   - 解码后字符串
 */
export const base64Decode = (str: string = ''): string => {
  return new Buffer(str, 'base64').toString('ascii').trim()
}

export const createConfigLoader = (opts: {
  optionsLoader?: FOptionsLoader
  requiredVariables?: string[]
}) => {
  return new ConfigLoader(opts)
}

export const loadDotEnv = (): JsonMap => {
  let suffix = process.env.ENV ? `.${process.env.ENV}` : ''
  if (
    !suffix &&
    process.env.NODE_ENV &&
    process.env.NODE_ENV !== 'production'
  ) {
    suffix = `.${process.env.NODE_ENV}`
  }
  const dotenvResult = dotenv.config({ path: `.env${suffix}` })
  if (dotenvResult.error) {
    console.warn(dotenvResult.error.message)
    return {}
  }
  return dotenvResult.parsed || {} // load .env into process.env}
}

/**
 *
 * @param key
 * @param options
 * @param defaultValue
 * @returns {any}
 */
export const loadEncodedConfig = (
  key: string,
  options: JsonMap,
  defaultValue: any
): any => {
  const value = process.env[key] || options[key]
  return value ? base64Decode(`${value}`) : defaultValue
}

/**
 * 配置读取器
 */
export class ConfigLoader {
  private optionsLoader: any
  private requiredVariables: string[]
  private options: JsonMap = {}

  constructor(
    opts: {
      optionsLoader?: FOptionsLoader
      requiredVariables?: string[]
    } = {}
  ) {
    this.optionsLoader = opts.optionsLoader
    this.requiredVariables = opts.requiredVariables || []
    this.options = loadDotEnv()
    this.validate()
  }

  /**
   * load config from env first, then options loader, and default at last.
   * @param {string} key            - property key
   * @param {any=null} defaultValue - default value
   * @returns {any}                 - property value
   */
  public loadConfig(key: string, defaultValue: any = null): any {
    return (
      process.env[key] ||
      this.options[key] ||
      this.loadConfigFromOptions(key) ||
      defaultValue
    )
  }

  public loadEncodedConfig(key: string, defaultValue: any = null): any {
    const encoded = process.env[key] || this.loadConfigFromOptions(key)
    return encoded ? base64Decode(encoded) : defaultValue
  }

  public loadConfigs(): Json {
    const configs = _.assign(_.zipObject(this.requiredVariables), this.options)
    return _.mapValues(configs, (value: Json, key: string) =>
      this.loadConfig(key)
    )
  }

  public setRequiredVariables(requires: string[]): void {
    this.requiredVariables = requires
  }

  public validate(): void {
    const notExists = _.filter(this.requiredVariables, (key: string) =>
      _.isNil(this.loadConfig(key))
    )
    if (!_.isEmpty(notExists)) {
      throw new Error(`[ConfigLoader] "${notExists}" is required.`)
    }
  }

  private loadConfigFromOptions(key: string): any {
    return _.isObjectLike(this.optionsLoader)
      ? _.get(this.optionsLoader, key)
      : _.isFunction(this.optionsLoader)
        ? _.get(this.optionsLoader(), key)
        : null
  }
}
