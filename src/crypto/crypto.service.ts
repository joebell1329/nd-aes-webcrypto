import { DecryptionParts } from './crypto.model';

export class CryptoService {

  /**
   * A 128 bit salt is recommended by NIST for PBKDF2
   * https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf
   */
  private static readonly SALT_LENGTH = 16;

  /**
   * For AES GCM, the strongly recommended IV length is 96 bits as longer IV's can lead to collisions.
   * https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf
   */
  private static readonly IV_LENGTH = 12;

  /**
   * The minimum recommended PBKDF2 iterations by OWASP
   * https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#pbkdf2
   */
  private static readonly DEFAULT_PBKDF2_ITERATIONS = 10000;

  public static async encrypt(data: string, password: string, pbkdf2Iterations?: number): Promise<string> {
    const encoder = new TextEncoder();

  const salt: Uint8Array = crypto.getRandomValues(new Uint8Array(CryptoService.SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(CryptoService.IV_LENGTH));
    const encodedData = encoder.encode(data);

    const cryptoKey = await CryptoService.getCryptoKeyForPassword(password);
    const derivedKey = await CryptoService.getDerivedKey(cryptoKey, salt, pbkdf2Iterations || CryptoService.DEFAULT_PBKDF2_ITERATIONS);

    const encryptedData = await crypto.subtle.encrypt(
      CryptoService.getAesGcmParams(iv),
      derivedKey,
      encodedData
    );

    return [...salt, ...iv, ...new Uint8Array(encryptedData) ].join(' ');
  }

  public static async decrypt(encryptedData: string, password: string, pbkdf2Iterations?: number): Promise<string> {
    const decoder = new TextDecoder();

    const { salt, iv, cipher } = CryptoService.extractDecryptionParts(encryptedData);
    const cryptoKey = await CryptoService.getCryptoKeyForPassword(password);
    const derivedKey = await CryptoService.getDerivedKey(cryptoKey, salt, pbkdf2Iterations || CryptoService.DEFAULT_PBKDF2_ITERATIONS);

    const decryptedBuffer = await crypto.subtle.decrypt(
      CryptoService.getAesGcmParams(iv),
      derivedKey,
      cipher
    );

    return decoder.decode(decryptedBuffer);
  }

  private static async getCryptoKeyForPassword(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const encodedPassword = encoder.encode(password);

    return crypto.subtle.importKey(
      'raw',
      encodedPassword,
      'PBKDF2',
      false,
      [ 'deriveKey', 'deriveBits' ]
    );
  }

  private static async getDerivedKey(cryptoKey: CryptoKey, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
    return crypto.subtle.deriveKey(
      CryptoService.getPBKDF2Params(salt, iterations),
      cryptoKey,
      CryptoService.getAesDerivedKeyParams(),
      false,
      [ 'encrypt', 'decrypt' ]
    );
  }

  private static extractDecryptionParts(encryptedData: string): DecryptionParts {
    const dataArr = new Uint8Array(encryptedData.split(' ').map(c => parseInt(c, 10)));

    const salt = dataArr.slice(0, CryptoService.SALT_LENGTH);
    const iv = dataArr.slice(CryptoService.SALT_LENGTH, CryptoService.SALT_LENGTH + CryptoService.IV_LENGTH);
    const cipher = dataArr.slice(CryptoService.SALT_LENGTH + CryptoService.IV_LENGTH);

    return { salt, iv, cipher };
  }

  private static getAesGcmParams(iv: Uint8Array): AesGcmParams {
    return {
      name: 'AES-GCM',
      iv
    };
  }

  private static getPBKDF2Params(salt: Uint8Array, iterations: number): Pbkdf2Params {
    return {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256'
    };
  }

  private static getAesDerivedKeyParams(): AesDerivedKeyParams {
    return {
      name: 'AES-GCM',
      length: 256
    };
  }

}
