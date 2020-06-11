import { CryptoService } from './crypto/crypto.service';

/**
 * Encrypts plaintext data using 256 bit AES-GCM encryption with a PBKDF2 derived key.
 * @param data - Plaintext data to encrypt.
 * @param password - Plaintext encryption password.
 * @param pbkdf2Iterations - (Optional) The number of PBKDF2 iterations to perform.
 *                           Defaults to 10000, but should be as high as possible with acceptable performance.
 */
export async function encrypt(data: string, password: string, pbkdf2Iterations?: number): Promise<string> {
  return CryptoService.encrypt(data, password, pbkdf2Iterations);
}

/**
 * Decrypts ciphertext data using 256 bit AES-GCM decryption with a PBKDF2 derived key.
 * @param encryptedData - The encrypted cipher to decrypt.
 * @param password - Plaintext decryption password.
 * @param pbkdf2Iterations - (Optional) The number of PBKDF2 iterations to perform.
 *                           Defaults to 10000, but should be as high as possible with acceptable performance.
 */
export async function decrypt(encryptedData: string, password: string, pbkdf2Iterations?: number): Promise<string> {
  return CryptoService.decrypt(encryptedData, password, pbkdf2Iterations);
}
