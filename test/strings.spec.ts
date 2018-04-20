import { toSnakeCase, toCamelCase } from '../src/node-buffs';

describe('strings toSnakeCase', () => {
  it('should cast camel case to underscore', () => {
    expect(toSnakeCase('a')).toBe('a');
    expect(toSnakeCase('A')).toBe('a');
    expect(toSnakeCase('Colleges')).toBe('colleges');
    expect(toSnakeCase('a_b')).toBe('a_b');
    expect(toSnakeCase('_a')).toBe('_a');
    // expect(toSnakeCase('_A')).toBe('_A');
    expect(toSnakeCase('AB')).toBe('a_b');
    expect(toSnakeCase('aB')).toBe('a_b');
    expect(toSnakeCase('aBCDefG')).toBe('a_b_c_def_g');
    expect(toSnakeCase(' aB ')).toBe('a_b');
  });
});

describe('strings toCamelCase', () => {
  it('should cast underscore to camel case', () => {
    expect(toCamelCase('_')).toBe('_');
    expect(toCamelCase('a')).toBe('a');
    expect(toCamelCase('A')).toBe('A');
    expect(toCamelCase('a_b')).toBe('aB');
    expect(toCamelCase('_a')).toBe('A');
    expect(toCamelCase('_A')).toBe('A');
    expect(toCamelCase('AB')).toBe('AB');
    expect(toCamelCase('aB')).toBe('aB');
    expect(toCamelCase('a_b_c_def_g')).toBe('aBCDefG');
    expect(toCamelCase(' a_b ')).toBe('aB');
  });
});
