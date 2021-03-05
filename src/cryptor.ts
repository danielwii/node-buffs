import * as crypto from 'crypto';

/**
 * 加密工具
 */
export class Cryptor {
  private readonly iterations: number;

  private readonly keylen: number;

  private readonly algorithm: string;

  public constructor(iterations = 10_000, keylen = 16, algorithm = 'sha512') {
    this.iterations = iterations;
    this.keylen = keylen;
    this.algorithm = algorithm;
  }

  public static generateSalt(length = 32): string {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

  public static encrypt(data: string, algorithm = 'sha512'): string {
    return crypto.createHash(algorithm).update(data).digest('hex');
  }

  /**
   * @param {string} password
   * @param {string} prefix
   * @returns {{hash: string; salt: string}}
   */
  public passwordEncrypt(password: string, prefix = ''): { hash: string; salt: string } {
    const salt = Cryptor.generateSalt();
    const encryptedPassword = Cryptor.encrypt(password);
    const generatedSalt = `${prefix}${salt}`;
    const hash = crypto
      .pbkdf2Sync(encryptedPassword, generatedSalt, this.iterations, this.keylen, this.algorithm)
      .toString('hex');
    return { hash, salt };
  }

  public passwordCompare(password: string, savedHash: string, savedSalt: string, prefix = ''): boolean {
    const encryptedPassword = Cryptor.encrypt(password);
    const generatedSalt = `${prefix}${savedSalt}`;
    return (
      savedHash ===
      crypto.pbkdf2Sync(encryptedPassword, generatedSalt, this.iterations, this.keylen, this.algorithm).toString('hex')
    );
  }

  // DES 加密
  public static desEncrypt(textToEncode: string, keyString = 'key', ivString = 'iv'): string {
    const [keyHex, ivHex] = this.calcKeyAndIV(keyString, ivString);

    const cipher = crypto.createCipheriv('des-cbc', keyHex, ivHex);
    let c = cipher.update(textToEncode, 'utf8', 'base64');
    c += cipher.final('base64');
    return c;
  }

  // DES 解密
  public static desDecrypt(textToDecode: string, keyString = 'key', ivString = 'iv'): string {
    const [keyHex, ivHex] = this.calcKeyAndIV(keyString, ivString);

    const cipher = crypto.createDecipheriv('des-cbc', keyHex, ivHex);
    let c = cipher.update(textToDecode, 'base64', 'utf8');
    c += cipher.final('utf8');
    return c;
  }

  private static calcKeyAndIV(keyStr: string, ivStr: string): [Buffer, Buffer] {
    const key = keyStr.length >= 8 ? keyStr.slice(0, 8) : keyStr.concat('0'.repeat(8 - keyStr.length));
    const keyHex = Buffer.from(key, 'utf8');

    const iv = ivStr.length >= 8 ? ivStr.slice(0, 8) : ivStr.concat('0'.repeat(8 - ivStr.length));
    const ivHex = Buffer.from(iv, 'utf8');
    return [keyHex, ivHex];
  }
}
