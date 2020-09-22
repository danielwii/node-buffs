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
      expect(loader.loadConfig('proxy_api', undefined, false, true)).toBe('http://localhost:5000');
      expect(loader.loadConfig('proxy_api')).toBeNull();
      expect(loader.loadConfig2('proxy', 'api')).toBe('http://localhost:5000');
      expect(loader.loadConfig2('hello', 'b.c.d')).toBeTruthy();
      expect(loader.loadConfig2('hello', 'b.c.d1')).toBe(1);
      expect(loader.loadConfig2('hello', 'b.c.d2')).toBe('world');
      expect(loader.loadConfig2('hello', 'b.c.d3_test')).toBe('world');
    });

    it('load ignore case', () => {
      expect(loader.loadConfig('a')).toBeNull();
    });

    it('should return default value if not exists', () => {
      expect(loader.loadConfig('a', 1)).toBe(1);
    });

    it('should load .env file', () => {
      process.env.ENV = 'example';
      expect(loader.loadConfigs({ autoConvert: true })).toEqual({
        env_loaded: true,
        env_number: 1,
        env_number_empty: null,
        env_number_empty2: null,
        env_string: 'hello kitty ^_^',
        env_string_empty: null,
        env_string_empty2: null,
        HELLO_B_C_D2: 'world',
        HELLO_B_C_D3_TEST: 'world',
        hello: { b: { c: { d: true, d1: 1, d2: 'test', d3_test: 'test' } } },
        secret: null,
        PROXY_API: 'http://localhost:5000',
        receipt: 'Oz-Ware Purchase Invoice',
        customer: { given: 'Dorothy', family: 'Gale', 'is-active': true },
        date: new Date('2012-08-06T00:00:00.000Z'),
        items: [
          { part_no: 'A4786', descrip: 'Water Bucket (Filled)', price: 1.47, quantity: 4 },
          { part_no: 'E1628', descrip: 'High Heeled "Ruby" Slippers', size: 8, price: 133.7, quantity: 1 },
        ],
        'bill-to': { street: '123 Tornado Alley\nSuite 16\n', city: 'East Centerville', state: 'KS' },
        'ship-to': { city: 'East Centerville', state: 'KS', street: '123 Tornado Alley\nSuite 16\n' },
        specialDelivery:
          'Follow the Yellow Brick Road to the Emerald City. Pay no attention to the man behind the curtain.\n',
      });
      expect(loader.loadConfigs()).toEqual({
        env_loaded: 'true',
        env_number: '1',
        env_number_empty: null,
        env_number_empty2: null,
        env_string: 'hello kitty ^_^',
        env_string_empty: null,
        env_string_empty2: null,
        HELLO_B_C_D2: 'world',
        HELLO_B_C_D3_TEST: 'world',
        hello: { b: { c: { d: true, d1: 1, d2: 'test', d3_test: 'test' } } },
        secret: null,
        PROXY_API: 'http://localhost:5000',
        receipt: 'Oz-Ware Purchase Invoice',
        customer: { given: 'Dorothy', family: 'Gale', 'is-active': true },
        date: new Date('2012-08-06T00:00:00.000Z'),
        items: [
          { part_no: 'A4786', descrip: 'Water Bucket (Filled)', price: 1.47, quantity: 4 },
          { part_no: 'E1628', descrip: 'High Heeled "Ruby" Slippers', size: 8, price: 133.7, quantity: 1 },
        ],
        'bill-to': { street: '123 Tornado Alley\nSuite 16\n', city: 'East Centerville', state: 'KS' },
        'ship-to': { city: 'East Centerville', state: 'KS', street: '123 Tornado Alley\nSuite 16\n' },
        specialDelivery:
          'Follow the Yellow Brick Road to the Emerald City. Pay no attention to the man behind the curtain.\n',
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

    it('should return correct string value', () => {
      const str = loader.loadConfig('secret');
      expect(str).toBe(null);

      const strWithDefault = loader.loadConfig('secret', 'secret');
      expect(strWithDefault).toBe('secret');
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

      const numString5 = loader.loadNumericConfig('env_number_empty', 0);
      expect(numString5).toBe(0);
      const numString6 = loader.loadNumericConfig('env_number_empty') || 0;
      expect(numString6).toBe(0);

      const numString7 = loader.loadNumericConfig('env_number_empty2', 0);
      expect(numString7).toBe(0);
      const numString8 = loader.loadNumericConfig('env_number_empty2') || 0;
      expect(numString8).toBe(0);
    });

    it('should return overwrite options first', () => {
      expect(loader.loadConfigs({ autoConvert: true })).toEqual({
        env_loaded: true,
        env_number: 1,
        env_number_empty: null,
        env_number_empty2: null,
        env_string: 'hello kitty ^_^',
        env_string_empty: null,
        env_string_empty2: null,
        HELLO_B_C_D2: 'world',
        HELLO_B_C_D3_TEST: 'world',
        hello: { b: { c: { d: true, d1: 1, d2: 'test', d3_test: 'test' } } },
        secret: null,
        PROXY_API: 'http://localhost:5000',
        receipt: 'Oz-Ware Purchase Invoice',
        customer: { given: 'Dorothy', family: 'Gale', 'is-active': true },
        date: new Date('2012-08-06T00:00:00.000Z'),
        items: [
          { part_no: 'A4786', descrip: 'Water Bucket (Filled)', price: 1.47, quantity: 4 },
          { part_no: 'E1628', descrip: 'High Heeled "Ruby" Slippers', size: 8, price: 133.7, quantity: 1 },
        ],
        'bill-to': { street: '123 Tornado Alley\nSuite 16\n', city: 'East Centerville', state: 'KS' },
        'ship-to': { city: 'East Centerville', state: 'KS', street: '123 Tornado Alley\nSuite 16\n' },
        specialDelivery:
          'Follow the Yellow Brick Road to the Emerald City. Pay no attention to the man behind the curtain.\n',
      });
      process.env.env_number = '2';
      expect(loader.loadConfigs({ autoConvert: true })).toEqual({
        env_loaded: true,
        env_number: 2,
        env_number_empty: null,
        env_number_empty2: null,
        env_string: 'hello kitty ^_^',
        env_string_empty: null,
        env_string_empty2: null,
        HELLO_B_C_D2: 'world',
        HELLO_B_C_D3_TEST: 'world',
        hello: { b: { c: { d: true, d1: 1, d2: 'test', d3_test: 'test' } } },
        secret: null,
        PROXY_API: 'http://localhost:5000',
        receipt: 'Oz-Ware Purchase Invoice',
        customer: { given: 'Dorothy', family: 'Gale', 'is-active': true },
        date: new Date('2012-08-06T00:00:00.000Z'),
        items: [
          { part_no: 'A4786', descrip: 'Water Bucket (Filled)', price: 1.47, quantity: 4 },
          { part_no: 'E1628', descrip: 'High Heeled "Ruby" Slippers', size: 8, price: 133.7, quantity: 1 },
        ],
        'bill-to': { street: '123 Tornado Alley\nSuite 16\n', city: 'East Centerville', state: 'KS' },
        'ship-to': { city: 'East Centerville', state: 'KS', street: '123 Tornado Alley\nSuite 16\n' },
        specialDelivery:
          'Follow the Yellow Brick Road to the Emerald City. Pay no attention to the man behind the curtain.\n',
      });
      loader.setOverwriteOptions({ env_number: '3' });
      expect(loader.loadConfigs({ autoConvert: true })).toEqual({
        env_loaded: true,
        env_number: 3,
        env_number_empty: null,
        env_number_empty2: null,
        env_string: 'hello kitty ^_^',
        env_string_empty: null,
        env_string_empty2: null,
        HELLO_B_C_D2: 'world',
        HELLO_B_C_D3_TEST: 'world',
        hello: { b: { c: { d: true, d1: 1, d2: 'test', d3_test: 'test' } } },
        secret: null,
        PROXY_API: 'http://localhost:5000',
        receipt: 'Oz-Ware Purchase Invoice',
        customer: { given: 'Dorothy', family: 'Gale', 'is-active': true },
        date: new Date('2012-08-06T00:00:00.000Z'),
        items: [
          { part_no: 'A4786', descrip: 'Water Bucket (Filled)', price: 1.47, quantity: 4 },
          { part_no: 'E1628', descrip: 'High Heeled "Ruby" Slippers', size: 8, price: 133.7, quantity: 1 },
        ],
        'bill-to': { street: '123 Tornado Alley\nSuite 16\n', city: 'East Centerville', state: 'KS' },
        'ship-to': { city: 'East Centerville', state: 'KS', street: '123 Tornado Alley\nSuite 16\n' },
        specialDelivery:
          'Follow the Yellow Brick Road to the Emerald City. Pay no attention to the man behind the curtain.\n',
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
      expect(configs).toEqual({ TEST: '^_^', base: 'loaded' });
    });
  });

  describe('createConfigLoader', () => {
    it('should create config loader by createConfigLoader', () => {
      process.env.TEST = '^_^';
      const loader = createConfigLoader({
        requiredVariables: ['TEST'],
      });
      const configs = loader.loadConfigs();
      expect(configs).toEqual({ TEST: '^_^', base: 'loaded' });
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
