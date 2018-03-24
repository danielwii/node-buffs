import { ConfigLoader, Cryptor } from '../src/node-buffs'

describe('ConfigLoader', () => {
  describe('No optionsLoader', () => {
    process.env.ENV = 'example'
    const loader = new ConfigLoader()

    it('should return null without default value', () => {
      expect(loader.loadConfig('a')).toBeNull()
    })

    it('should return default value if not exists', () => {
      expect(loader.loadConfig('a', 1)).toBe(1)
    })

    it('should load .env file', () => {
      process.env.ENV = 'example'
      const env = loader.loadConfigs()
      expect(env).toEqual({ env_loaded: 'true' })
    })

    it('should return error when load .env.not-exists', () => {
      process.env.ENV = 'not-exists'
      const env = loader.loadConfigs()
      expect(!!env).toBeTruthy()
    })

    process.env.ENV = null
  })

  describe('With optionsLoader as Object', () => {
    const loader = new ConfigLoader({ optionsLoader: { a: '^_^' } })

    it('should return null without default value', () => {
      expect(loader.loadConfig('b')).toBeNull()
    })

    it('should return default value if not exists', () => {
      expect(loader.loadConfig('a', 1)).toBe('^_^')
    })
  })

  describe('With optionsLoader as Function', () => {
    const loader = new ConfigLoader({ optionsLoader: () => ({ a: '^_^' }) })

    it('should return null without default value', () => {
      expect(loader.loadConfig('b')).toBeNull()
    })

    it('should return default value if not exists', () => {
      expect(loader.loadConfig('a', 1)).toBe('^_^')
    })
  })

  describe('With requiredOptions', () => {
    it('should throw error when setRequiredVariables', () => {
      const loader = new ConfigLoader()
      loader.setRequiredVariables(['test-required-1', 'test-required-2'])
      expect(() => {
        loader.validate()
      }).toThrowError(
        '[ConfigLoader] "test-required-1,test-required-2" is required.'
      )
    })

    it('should throw error when set requiredOptions', () => {
      expect(() => {
        const loader = new ConfigLoader({
          requiredVariables: ['test-required-1', 'test-required-2']
        })
      }).toThrowError(
        '[ConfigLoader] "test-required-1,test-required-2" is required.'
      )
    })

    it('should return values from process.env', () => {
      process.env.TEST = '^_^'
      const loader = new ConfigLoader({
        requiredVariables: ['TEST']
      })
      const configs = loader.loadConfigs()
      expect(configs).toEqual({ TEST: '^_^' })
    })
  })
})

describe('Cryptor', () => {
  const cryptor = new Cryptor()

  it('generate salt with required length', () => {
    expect(Cryptor.generateSalt().length).toBe(32)
    expect(Cryptor.generateSalt(1).length).toBe(1)
    expect(Cryptor.generateSalt(64).length).toBe(64)
  })

  it('encrypt data using sha512 digest by default', () => {
    const expected =
      'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb9' +
      '80b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86'
    expect(Cryptor.encrypt('password')).toBe(expected)
  })

  it('generate password and salt and can be compared', () => {
    let result = cryptor.passwordEncrypt('password', '123')
    expect(result.hash.length).toBe(32)
    expect(result.salt.length).toBe(32)
    expect(
      cryptor.passwordCompare('password', result.hash, result.salt, '123')
    ).toBe(true)
    expect(cryptor.passwordCompare('password', result.hash, result.salt)).toBe(
      false
    )
  })
})
