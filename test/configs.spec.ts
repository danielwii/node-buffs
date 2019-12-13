import { ConfigLoader, createConfigLoader } from '../src/node-buffs';

beforeEach(() => {
  // ...
});

afterEach(() => {
  delete process.env.ENV;
  delete process.env.PROXY_API;
  delete process.env.env_loaded;
  delete process.env.env_number;
  delete process.env.env_string;
  delete process.env.a;
  delete process.env.b;
});

describe('ConfigLoader', () => {
  describe('No optionsLoader', () => {
    process.env.ENV = 'test';
    const loader = new ConfigLoader({ path: __dirname });

    it('should return null without default value', () => {
      expect(loader.loadConfig('a')).toBeNull();
    });

    it('should return default value if not exists', () => {
      expect(loader.loadConfig('a', 1)).toBe(1);
    });

    it('should load .env file', () => {
      process.env.ENV = 'example';
      expect(loader.loadConfigs()).toEqual({
        env_loaded: true,
        env_number: 1,
        env_number_empty: null,
        env_string: 'hello kitty ^_^',
        PROXY_API: 'http://localhost:5000',
      });
      expect(loader.loadConfigs({ autoConvert: false })).toEqual({
        env_loaded: 'true',
        env_number: '1',
        env_number_empty: '',
        env_string: 'hello kitty ^_^',
        PROXY_API: 'http://localhost:5000',
      });
    });

    it('should return error when load .env.not-exists', () => {
      process.env.ENV = 'not-exists';
      const env = loader.loadConfigs();
      expect(!!env).toBeTruthy();
    });

    it('should return correct boolean value', () => {
      const falsy = loader.loadConfig('bool_test', false);
      expect(!!falsy).toBeFalsy();
      const truthy = loader.loadConfig('bool_test', true);
      expect(!!truthy).toBeTruthy();

      const boolFalsy = loader.loadBoolConfig('bool_test', false);
      expect(boolFalsy).toBeFalsy();
      const boolTruthy = loader.loadBoolConfig('bool_test', true);
      expect(boolTruthy).toBeTruthy();
    });

    it('should return correct string boolean value', () => {
      const falsy = loader.loadConfig('bool_test', 'false');
      expect(falsy).toBe('false');
      const truthy = loader.loadConfig('bool_test', 'true');
      expect(truthy).toBe('true');

      const boolStrFalsy = loader.loadBoolConfig('bool_test', 'false' as any);
      expect(boolStrFalsy).toBeFalsy();
      const boolStrTruthy = loader.loadBoolConfig('bool_test', 'true' as any);
      expect(boolStrTruthy).toBeTruthy();
      const boolFalsy = loader.loadBoolConfig('bool_test', false);
      expect(boolFalsy).toBeFalsy();
      const boolTruthy = loader.loadBoolConfig('bool_test', true);
      expect(boolTruthy).toBeTruthy();
    });

    it('should return correct numeric boolean value', () => {
      const numString = loader.loadConfig('num_test', '1');
      expect(numString).toBe('1');
      const numString2 = loader.loadConfig('num_test', 1);
      expect(numString2).toBe(1);

      const numString3 = loader.loadNumericConfig('num_test', 1);
      expect(numString3).toBe(1);

      const numString4 = loader.loadNumericConfig('env_number_empty');
      expect(numString4).toBe(null);
    });

    it('should return overwrite options first', () => {
      expect(loader.loadConfigs()).toEqual({
        env_loaded: true,
        env_number: 1,
        env_number_empty: null,
        env_string: 'hello kitty ^_^',
        PROXY_API: 'http://localhost:5000',
      });
      process.env.env_number = '2';
      expect(loader.loadConfigs()).toEqual({
        env_loaded: true,
        env_number: 2,
        env_number_empty: null,
        env_string: 'hello kitty ^_^',
        PROXY_API: 'http://localhost:5000',
      });
      loader.setOverwriteOptions({ env_number: '3' });
      expect(loader.loadConfigs()).toEqual({
        env_loaded: true,
        env_number: 3,
        env_number_empty: null,
        env_string: 'hello kitty ^_^',
        PROXY_API: 'http://localhost:5000',
      });
    });
  });

  describe('With optionsLoader as Object', () => {
    const loader = new ConfigLoader({ optionsLoader: { a: '^_^' } });

    it('should return null without default value', () => {
      expect(loader.loadConfig('b')).toBeNull();
    });

    it('should return default value if not exists', () => {
      expect(loader.loadConfig('a', 1)).toBe('^_^');
    });
  });

  describe('With optionsLoader as Function', () => {
    const loader = new ConfigLoader({ optionsLoader: () => ({ a: '^_^' }) });

    it('should return null without default value', () => {
      expect(loader.loadConfig('b')).toBeNull();
    });

    it('should return default value if not exists', () => {
      expect(loader.loadConfig('a', 1)).toBe('^_^');
    });
  });

  describe('With requiredOptions', () => {
    it('should throw error when setRequiredVariables', () => {
      const loader = new ConfigLoader({ path: 'test', suffix: 'test' }); // test/.env.test
      loader.setRequiredVariables(['test-required-1', 'test-required-2']);
      expect(() => {
        loader.validate();
      }).toThrowError('[ConfigLoader] "test-required-1,test-required-2" is required.');
    });

    it('should throw error when set requiredOptions', () => {
      expect(() => {
        const loader = new ConfigLoader({
          requiredVariables: ['test-required-1', 'test-required-2'],
        });
        loader.validate();
      }).toThrowError('[ConfigLoader] "test-required-1,test-required-2" is required.');
    });

    it('should return configs when set requiredOptions and load from env', () => {
      process.env.ENV = 'test';
      const loader = new ConfigLoader({
        path: './test',
        requiredVariables: ['env_loaded'],
      });
      expect(loader.loadConfig('env_loaded')).toBeTruthy();
    });

    it('should return values from process.env', () => {
      process.env.TEST = '^_^';
      const loader = new ConfigLoader({
        requiredVariables: ['TEST'],
      });
      const configs = loader.loadConfigs();
      expect(configs).toEqual({ TEST: '^_^' });
    });
  });

  describe('createConfigLoader', () => {
    it('should create config loader by createConfigLoader', () => {
      process.env.TEST = '^_^';
      const loader = createConfigLoader({
        requiredVariables: ['TEST'],
      });
      const configs = loader.loadConfigs();
      expect(configs).toEqual({ TEST: '^_^' });
    });

    // it('should load configs after call loads/load by set delay to true', function() {
    //   process.env.ENV = 'test-not-exists';
    //   const loader = new ConfigLoader({
    //     delay: true,
    //     requiredVariables: ['TEST'],
    //   });
    //   process.env.ENV = 'test';
    //   expect(loader.loadConfig('env_loaded')).toBeTruthy();
    // });
  });
});
