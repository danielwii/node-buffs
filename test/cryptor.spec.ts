import { Cryptor } from '../src/cryptor';

describe('Cryptor', () => {
  describe('default', () => {
    const cryptor = new Cryptor();

    it('generate salt with required length', () => {
      expect(Cryptor.generateSalt().length).toBe(32);
      expect(Cryptor.generateSalt(1).length).toBe(1);
      expect(Cryptor.generateSalt(64).length).toBe(64);
    });

    it('encrypt data using sha512 digest by default', () => {
      const expected =
        'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb9' +
        '80b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86';
      expect(Cryptor.encrypt('password')).toBe(expected);
    });

    it('encrypt data using sha256 digest by default', () => {
      const expected = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
      expect(Cryptor.encrypt('password', 'sha256')).toBe(expected);
    });

    it('generated password / salt with prefix can be compared', () => {
      let result = cryptor.passwordEncrypt('password');
      expect(result.hash.length).toBe(32);
      expect(result.salt.length).toBe(32);
      expect(cryptor.passwordCompare('password', result.hash, result.salt)).toBe(true);
    });

    it('generated password / salt can be compared', () => {
      let result = cryptor.passwordEncrypt('password', '123');
      expect(result.hash.length).toBe(32);
      expect(result.salt.length).toBe(32);
      expect(cryptor.passwordCompare('password', result.hash, result.salt, '123')).toBe(true);
      expect(cryptor.passwordCompare('password', result.hash, result.salt)).toBe(false);
    });
  });

  describe('custom', () => {
    const cryptor = new Cryptor(1, 8, 'sha256');

    it('generate salt with required length', () => {
      expect(Cryptor.generateSalt().length).toBe(32);
      expect(Cryptor.generateSalt(1).length).toBe(1);
      expect(Cryptor.generateSalt(64).length).toBe(64);
    });

    it('encrypt data using sha512 digest by default', () => {
      const expected =
        'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb9' +
        '80b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86';
      expect(Cryptor.encrypt('password')).toBe(expected);
    });

    it('generate password and salt and can be compared', () => {
      let result = cryptor.passwordEncrypt('password', '123');
      expect(result.hash.length).toBe(16);
      expect(result.salt.length).toBe(32);
      expect(cryptor.passwordCompare('password', result.hash, result.salt, '123')).toBe(true);
      expect(cryptor.passwordCompare('password', result.hash, result.salt)).toBe(false);
    });
  });

  describe('des', () => {
    it('should create correct encrypted code', function() {
      expect(Cryptor.desEncrypt('test-password', 'secret', 'iv')).toBe('qFiFADRlMbj/Qz18pz+OeA==');
      expect(Cryptor.desDecrypt('qFiFADRlMbj/Qz18pz+OeA==', 'secret', 'iv')).toBe('test-password');
    });

    it('should create correct encrypted code with empty key', function() {
      expect(Cryptor.desEncrypt('test-password')).toBe('WRBGlfgOb0ICR3mvZ/cKBw==');
      expect(Cryptor.desDecrypt('WRBGlfgOb0ICR3mvZ/cKBw==')).toBe('test-password');
    });

    it('should create correct encrypted code with longer key', function() {
      expect(Cryptor.desEncrypt('test-password', '1234567890', '1234567890')).toBe(
        'YU+eI8bVBKEzK9+4fTbxEA=='
      );
      expect(Cryptor.desDecrypt('YU+eI8bVBKEzK9+4fTbxEA==', '1234567890', '1234567890')).toBe(
        'test-password'
      );
    });
  });
});
