import { Cryptor } from '../src/node-buffs'

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
