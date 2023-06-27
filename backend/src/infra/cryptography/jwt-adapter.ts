import jwt from "jsonwebtoken";
import {
  TokenPayload,
  TokenProvider,
  TokenResponse,
} from "../../domain/use-cases/user/authentication/ports/token-provider";

export class JwtAdapter implements TokenProvider {
  private readonly secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  async sign(payload: TokenPayload, expires?: string): Promise<string> {
    console.log("CRIANDO TOKEN = ", payload);
    return jwt.sign(payload, this.secret, {
      subject: `${payload.accountId}`,
      expiresIn: expires || "30d",
    });
  }

  async verify(token: string): Promise<TokenResponse> {
    return jwt.verify(token, this.secret) as TokenResponse;
  }
}
