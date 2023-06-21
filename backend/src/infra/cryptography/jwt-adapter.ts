import jwt from "jsonwebtoken";

export class JwtAdapter {
  constructor(private readonly secret: string) {}

  async sign(payload: string, expires?: string): Promise<string> {
    return jwt.sign({ id: payload }, this.secret);
  }

  async verify(token: string): Promise<string> {
    return jwt.verify(token, this.secret) as any;
  }
}
