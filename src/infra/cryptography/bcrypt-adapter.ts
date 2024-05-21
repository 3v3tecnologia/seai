import bcrypt from "bcrypt";
import crypto from 'crypto';
import { Encoder } from "../../domain/use-cases/_ports/cryptography/encoder";

export class CryptoAdapter implements Encoder {
  private readonly salt: number;

  constructor(salt?: number) {
    this.salt = salt || 10;
  }

  async hash(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, this.salt);
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest);
  }

}


export async function hashInPbkdf2(userEmail: string, salt: string, iterations: number, keylen: number, digest: string): Promise<Error | string> {
  // Asynchronously generate the hash
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(userEmail, salt, iterations, keylen, digest, (err, derivedKey) => {
      if (err) reject(err);
      // The derivedKey is the hash code generated from the user's email and the salt
      const hash = derivedKey.toString('hex');
      resolve(hash)
    });
  })
}