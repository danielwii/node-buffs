const assert = require('assert');

const buffs = require('../dist');

describe('ConfigLoader', () => {

  describe('No optionsLoader', () => {
    const loader = new buffs.ConfigLoader();

    it('return null without default value', () => {
      assert(loader.loadConfig('a') === null);
    });
    it('return default value if not exists', () => {
      assert(loader.loadConfig('a', 1) === 1);
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
