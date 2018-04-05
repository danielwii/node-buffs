/**
 * 加密工具
 */
export declare class Cryptor {
    private readonly iterations;
    private readonly keylen;
    private readonly digest;
    constructor(iterations?: number, keylen?: number, digest?: string);
    static generateSalt(length?: number): string;
    static encrypt(data: string, digest?: string): string;
    /**
     * @param {string} password
     * @param {string} prefix
     * @returns {{hash: string; salt: string}}
     */
    passwordEncrypt(password: string, prefix?: string): {
        hash: string;
        salt: string;
    };
    passwordCompare(password: string, savedHash: string, savedSalt: string, prefix?: string): boolean;
}
