export type DecryptionParts = {
  /**
   * The encrypted cipher.
   */
  cipher: ArrayBuffer;

  /**
   * The cryptographic salt for PBKDF2.
   */
  salt: Uint8Array;

  /**
   * The initialization vector for GCM.
   */
  iv: Uint8Array;
}
