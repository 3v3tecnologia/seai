export interface Encoder {
  hash(plain: string): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
  hashInPbkdf2(userEmail: string, iterations: number, keylen: number, digest: string): Promise<Error | string>
}
