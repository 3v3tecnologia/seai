import bcrypt from "bcrypt";
import crypto from "crypto";
import { Encoder } from "../../ports/encoder";

export class BcryptAdapter implements Encoder {
  private readonly hashSalt: string;

  constructor(salt?: string) {
    this.hashSalt = salt || "89af61e3502242626";
  }

  async hash(plaintext: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plaintext, salt);
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest);
  }

  generateRandomHexCode(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }

  async hashInPbkdf2(
    data: string,
    iterations: number,
    keylen: number,
    digest: string
  ): Promise<Error | string> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        data,
        this.hashSalt,
        iterations,
        keylen,
        digest,
        (err, derivedKey) => {
          if (err) reject(err);
          const hash = derivedKey.toString("hex");
          resolve(hash);
        }
      );
    });
  }
}
