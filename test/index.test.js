const assert = require('assert');

const buffs = require('../dist');

describe('ConfigLoader', () => {

  process.env.ENV = 'example';

  describe('No optionsLoader', () => {
    const loader = new buffs.ConfigLoader();

    it('return null without default value', () => {
      assert(loader.loadConfig('a') === null);
    });
    it('return default value if not exists', () => {
      assert(loader.loadConfig('a', 1) === 1);
    });

    it('.env file loaded', () => {
      const dotenvResult = buffs.loadDotEnv();
      assert(dotenvResult.parsed.env_loaded === 'true');
    });

    it('.env.not-exists returns error', () => {
      process.env.ENV    = 'not-exists';
      const dotenvResult = buffs.loadDotEnv();
      assert(!!dotenvResult.error);
    });
  });

  describe('With optionsLoader as Object', () => {
    const loader = new buffs.ConfigLoader({ a: '^_^' });

    it('return null without default value', () => {
      assert(loader.loadConfig('b') === null);
    });
    it('return default value if not exists', () => {
      assert(loader.loadConfig('a', 1) === '^_^');
    });
  });

  describe('With optionsLoader as Function', () => {
    const loader = new buffs.ConfigLoader(() => ({ a: '^_^' }));

    it('return null without default value', () => {
      assert(loader.loadConfig('b') === null);
    });
    it('return default value if not exists', () => {
      assert(loader.loadConfig('a', 1) === '^_^');
    });
  });
});

describe('Cryptor', () => {
  const cryptor = new buffs.Cryptor();

  it('generate salt with required length', () => {
    assert(buffs.Cryptor.generateSalt().length === 32);
    assert(buffs.Cryptor.generateSalt(1).length === 1);
    assert(buffs.Cryptor.generateSalt(64).length === 64);
  });
  it('encrypt data using sha512 digest by default', () => {
    const expected =
            'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb9' +
            '80b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86';
    assert(buffs.Cryptor.encrypt('password') === expected);
  });
  it('generate password and salt and can be compared', () => {
    let result = cryptor.passwordEncrypt('password', '123');
    assert(result.hash.length === 32);
    assert(result.salt.length === 32);
    assert(cryptor.passwordCompare('password', result.hash, result.salt, '123') === true);
    assert(cryptor.passwordCompare('password', result.hash, result.salt) === false);
  })
});
