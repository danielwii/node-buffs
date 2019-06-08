import * as crypto from 'crypto';

/**
 * 加密工具
 */
export class Cryptor {
  private readonly iterations: number;
  private readonly keylen: number;
  private readonly algorithm: string;

  constructor(iterations: number = 10000, keylen: number = 16, algorithm: string = 'sha512') {
    this.iterations = iterations;
    this.keylen = keylen;
    this.algorithm = algorithm;
  }

  static generateSalt(length: number = 32): string {
    return crypto
      .randomBytes(length)
      .toString('hex')
      .slice(0, length);
  }

  static encrypt(data: string, algorithm: string = 'sha512'): string {
    return crypto
      .createHash(algorithm)
      .update(data)
      .digest('hex');
  }

  /**
   * @param {string} password
   * @param {string} prefix
   * @returns {{hash: string; salt: string}}
   */
  passwordEncrypt(password: string, prefix: string = ''): { hash: string; salt: string } {
    const salt = Cryptor.generateSalt();
    const encryptedPassword = Cryptor.encrypt(password);
    const generatedSalt = `${prefix}${salt}`;
    const hash = crypto
      .pbkdf2Sync(encryptedPassword, generatedSalt, this.iterations, this.keylen, this.algorithm)
      .toString('hex');
    return { hash, salt };
  }

  passwordCompare(password: string, savedHash: string, savedSalt: string, prefix: string = '') {
    const encryptedPassword = Cryptor.encrypt(password);
    const generatedSalt = `${prefix}${savedSalt}`;
    return (
      savedHash ===
      crypto
        .pbkdf2Sync(encryptedPassword, generatedSalt, this.iterations, this.keylen, this.algorithm)
        .toString('hex')
    );
  }

  // DES 加密
  static desEncrypt(textToEncode: string, keyString: string = 'key', ivString: string = 'iv') {
    keyString =
      keyString.length >= 8
        ? keyString.slice(0, 8)
        : keyString.concat('0'.repeat(8 - keyString.length));
    const keyHex = Buffer.from(keyString, 'utf8');

    ivString =
      ivString.length >= 8
        ? ivString.slice(0, 8)
        : ivString.concat('0'.repeat(8 - ivString.length));
    const ivHex = Buffer.from(ivString, 'utf8');

    const cipher = crypto.createCipheriv('des-cbc', keyHex, ivHex);
    let c = cipher.update(textToEncode, 'utf8', 'base64');
    c += cipher.final('base64');
    return c;
  }

  // DES 解密
  static desDecrypt(textToDecode: string, keyString: string = 'key', ivString: string = 'iv') {
    keyString =
      keyString.length >= 8
        ? keyString.slice(0, 8)
        : keyString.concat('0'.repeat(8 - keyString.length));
    const keyHex = Buffer.from(keyString, 'utf8');

    ivString =
      ivString.length >= 8
        ? ivString.slice(0, 8)
        : ivString.concat('0'.repeat(8 - ivString.length));
    const ivHex = Buffer.from(ivString, 'utf8');

    const cipher = crypto.createDecipheriv('des-cbc', keyHex, ivHex);
    let c = cipher.update(textToDecode, 'base64', 'utf8');
    c += cipher.final('utf8');
    return c;
  }
}
