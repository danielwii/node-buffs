import { toUnderscore, toCamelCase } from '../src/node-buffs'

describe('strings toUnderscore', () => {
  it('should cast camel case to underscore', () => {
    expect(toUnderscore('a')).toBe('a')
    expect(toUnderscore('A')).toBe('A')
    expect(toUnderscore('a_b')).toBe('a_b')
    expect(toUnderscore('_a')).toBe('_a')
    // expect(toUnderscore('_A')).toBe('_A');
    expect(toUnderscore('AB')).toBe('a_b')
    expect(toUnderscore('aB')).toBe('a_b')
    expect(toUnderscore('aBCDefG')).toBe('a_b_c_def_g')
    expect(toUnderscore(' aB ')).toBe('a_b')
    expect(toUnderscore(null)).toBe(null)
  })
})

describe('strings toCamelCase', () => {
  it('should cast underscore to camel case', () => {
    expect(toCamelCase('_')).toBe('_')
    expect(toCamelCase('a')).toBe('a')
    expect(toCamelCase('A')).toBe('A')
    expect(toCamelCase('a_b')).toBe('aB')
    expect(toCamelCase('_a')).toBe('A')
    expect(toCamelCase('_A')).toBe('A')
    expect(toCamelCase('AB')).toBe('AB')
    expect(toCamelCase('aB')).toBe('aB')
    expect(toCamelCase('a_b_c_def_g')).toBe('aBCDefG')
    expect(toCamelCase(' a_b ')).toBe('aB')
    expect(toCamelCase(null)).toBe(null)
  })
})
