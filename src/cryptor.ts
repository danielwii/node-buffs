import * as crypto from 'crypto'

/**
 * 加密工具
 */
export class Cryptor {
  private readonly iterations: number
  private readonly keylen: number
  private readonly digest: string

  constructor(
    iterations: number = 10000,
    keylen: number = 16,
    digest: string = 'sha512'
  ) {
    this.iterations = iterations
    this.keylen = keylen
    this.digest = digest
  }

  static generateSalt(length: number = 32): string {
    return crypto
      .randomBytes(length)
      .toString('hex')
      .slice(0, length)
  }

  static encrypt(data: string, digest: string = 'sha512'): string {
    return crypto
      .createHash(digest)
      .update(data)
      .digest('hex')
  }

  /**
   * @param {string} password
   * @param {string} prefix
   * @returns {{hash: string; salt: string}}
   */
  passwordEncrypt(
    password: string,
    prefix: string = ''
  ): { hash: string; salt: string } {
    const salt = Cryptor.generateSalt()
    const encryptedPassword = Cryptor.encrypt(password)
    const generatedSalt = `${prefix}${salt}`
    const hash = crypto
      .pbkdf2Sync(
        encryptedPassword,
        generatedSalt,
        this.iterations,
        this.keylen,
        this.digest
      )
      .toString('hex')
    return { hash, salt }
  }

  passwordCompare(
    password: string,
    savedHash: string,
    savedSalt: string,
    prefix: string = ''
  ) {
    const encryptedPassword = Cryptor.encrypt(password)
    const generatedSalt = `${prefix}${savedSalt}`
    return (
      savedHash ===
      crypto
        .pbkdf2Sync(
          encryptedPassword,
          generatedSalt,
          this.iterations,
          this.keylen,
          this.digest
        )
        .toString('hex')
    )
  }
}
