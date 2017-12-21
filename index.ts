import * as _ from 'lodash';

export class ConfigLoader {
  private optionsLoader: object | { (): object };

  constructor(optionsLoader) {
    this.optionsLoader = optionsLoader;
  }

  private loadConfigFromOptions(key: string): any {
    return _.isObject(this.optionsLoader)
      ? _.get(this.optionsLoader, key)
      : _.isFunction(this.optionsLoader) ? _.get(this.optionsLoader(), key) : null;
  }

  /**
   * 采用 base64 解码字符串
   * @param {string} str  - 字符串
   * @returns {string}    - 解码后字符串
   */
  private static base64Decode(str: string = ''): string {
    return new Buffer(str, 'base64').toString('ascii').trim();
  }

  /**
   * load config from env first, then options loader, and default at last.
   * @param {string} key        - property key
   * @param {any?} defaultValue - default value
   * @returns {any}             - property value
   */
  loadConfig(key: string, defaultValue?: any): any {
    return process.env[key] || this.loadConfigFromOptions(key) || defaultValue;
  }

  loadEncodedConfig(key: string, defaultValue?: any): any {
    const encoded = process.env[key] || this.loadConfigFromOptions(key);
    return encoded ? ConfigLoader.base64Decode(encoded) : defaultValue;
  }
}

export const loadConfig = (key: string,
                           options: { [name: string]: any },
                           defaultValue: any): any => {
  return process.env[key] || options[key] || defaultValue;
};

export const loadEncodedConfig = (key,
                                  options: { [name: string]: any },
                                  defaultValue): any => {
  const value = process.env[key] || options[key];
  if (value) {
    return new Buffer(value, 'base64').toString('ascii').trim();
  }
  return defaultValue;
};
