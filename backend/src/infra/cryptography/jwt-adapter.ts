import jwt from "jsonwebtoken";
import {
  TokenPayload,
  TokenProvider,
} from "../../domain/use-cases/user/authentication/ports/token-provider";

export class JwtAdapter implements TokenProvider {
  private readonly secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  async sign(payload: TokenPayload, expires?: string): Promise<string> {
    return jwt.sign(payload, this.secret, {
      expiresIn: expires || "30d",
    });
  }

  async verify(token: string): Promise<TokenPayload> {
    return jwt.verify(token, this.secret) as TokenPayload;
  }
}
