// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import * as crypto from 'crypto'

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

const dotenv = require('dotenv')

// --------------------------------------------------------------
// Define Types
// --------------------------------------------------------------

export interface JsonMap {
  [member: string]: string | number | boolean | null | JsonArray | JsonMap
}

export interface JsonArray
  extends Array<string | number | boolean | null | JsonArray | JsonMap> {}

export type Json = JsonMap | JsonArray | string | number | boolean | null

export type Func = () => any

export type FOptionsLoader = Json | Func

// --------------------------------------------------------------
// Core Classes
// --------------------------------------------------------------

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
export abstract class AbstractReduxModuleWithSage {
  private moduleName: string

  constructor(moduleName: string = 'root') {
    this.moduleName = moduleName
  }

  public exports() {
    return {
      actionTypes: this.actionTypesWrapper(),
      actions: this.actions(),
      sagas: this.sagas(),
      reducer: this.reducer()
    }
  }

  // ACTION: 'module::action'
  abstract actionTypes(): JsonMap

  // action: (args): dispatchFunction
  abstract actions(): JsonMap

  // takeLatest / takeEvery (actionType, actionSage)
  abstract sagas(): any[]

  abstract initialState(): JsonMap

  abstract reducer(): JsonMap

  protected actionTypesWrapper() {
    return _.mapValues(
      this.actionTypes(),
      (value: string) => `${this.moduleName}::${value}`
    )
  }
}

export const createConfigLoader = (options: {
  optionsLoader?: FOptionsLoader
  requiredVariables?: string[]
}) => {
  return new ConfigLoader(options)
}

/**
 * 配置读取器
 */
export class ConfigLoader {
  private optionsLoader: object | { (): object } | any
  private requiredVariables: string[]

  constructor(
    options: {
      optionsLoader?: FOptionsLoader
      requiredVariables?: string[]
    } = {}
  ) {
    this.optionsLoader = options.optionsLoader
    this.requiredVariables = options.requiredVariables || []
    this.validate()
  }

  /**
   * load config from env first, then options loader, and default at last.
   * @param {string} key            - property key
   * @param {any=null} defaultValue - default value
   * @returns {any}                 - property value
   */
  public loadConfig(key: string, defaultValue: any = null): any {
    return process.env[key] || this.loadConfigFromOptions(key) || defaultValue
  }

  public loadEncodedConfig(key: string, defaultValue: any = null): any {
    const encoded = process.env[key] || this.loadConfigFromOptions(key)
    return encoded ? base64Decode(encoded) : defaultValue
  }

  public loadConfigs(): Json {
    const configs = _.assign(_.zipObject(this.requiredVariables), loadDotEnv())
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

/**
 * 加密工具
 */
export class Cryptor {
  private readonly iterations: number
  private readonly keylen: number
  private readonly digest: string

  constructor(
    iterations: number = 10000,
    keylen: number = 16,
    digest: string = 'sha512'
  ) {
    this.iterations = iterations
    this.keylen = keylen
    this.digest = digest
  }

  static generateSalt(length: number = 32): string {
    return crypto
      .randomBytes(length)
      .toString('hex')
      .slice(0, length)
  }

  static encrypt(data: string, digest: string = 'sha512'): string {
    return crypto
      .createHash(digest)
      .update(data)
      .digest('hex')
  }

  /**
   * @param {string} password
   * @param {string} prefix
   * @returns {{hash: string; salt: string}}
   */
  passwordEncrypt(
    password: string,
    prefix: string = ''
  ): { hash: string; salt: string } {
    const salt = Cryptor.generateSalt()
    const encryptedPassword = Cryptor.encrypt(password)
    const generatedSalt = `${prefix}${salt}`
    const hash = crypto
      .pbkdf2Sync(
        encryptedPassword,
        generatedSalt,
        this.iterations,
        this.keylen,
        this.digest
      )
      .toString('hex')
    return { hash, salt }
  }

  passwordCompare(
    password: string,
    savedHash: string,
    savedSalt: string,
    prefix: string = ''
  ) {
    const encryptedPassword = Cryptor.encrypt(password)
    const generatedSalt = `${prefix}${savedSalt}`
    return (
      savedHash ===
      crypto
        .pbkdf2Sync(
          encryptedPassword,
          generatedSalt,
          this.iterations,
          this.keylen,
          this.digest
        )
        .toString('hex')
    )
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
export const base64Decode = (str: string = ''): string => {
  return new Buffer(str, 'base64').toString('ascii').trim()
}

/**
 *
 * @param {string} str
 * @returns {string}
 */
export const base64Encode = (str: string = ''): string => {
  return new Buffer(str).toString('base64')
}

export const loadDotEnv = (): Json => {
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
  return dotenvResult.parsed // load .env into process.env}
}

/**
 *
 * @param {string} key
 * @param options
 * @param defaultValue
 * @returns {any}
 */
export const loadConfig = (
  key: string,
  options: JsonMap,
  defaultValue: any
): any => {
  return process.env[key] || options[key] || defaultValue
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

export const reduxAction = (type: string, payload = {}, error = null) => ({
  type,
  payload,
  error
})
