import bcrypt from "bcrypt";
import { Encoder } from "../../domain/use-cases/_ports/cryptography/encoder";

export class BcryptAdapter implements Encoder {
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
