import { ConfigLoader } from '../src/node-buffs'

beforeEach(() => {
  // delete process.env.ENV
})

afterEach(() => {
  delete process.env.ENV
  delete process.env.env_loaded
  delete process.env.a
  delete process.env.b
})

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

    it('should return configs when set requiredOptions and load from env', () => {
      process.env.ENV = 'example'
      const loader = new ConfigLoader({
        requiredVariables: ['env_loaded']
      })
      expect(loader.loadConfig('env_loaded')).toBeTruthy()
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
