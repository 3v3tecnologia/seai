import { HttpResponse } from "../controllers/ports";
import { Middleware } from "./ports/middleware";

import { TokenProvider } from "../../domain/use-cases/user/authentication/ports/token-provider";
import ENV from "../../server/http/env";
import { forbidden, ok, unauthenticated } from "../controllers/helpers";
export class AuthMiddleware implements Middleware {
  private readonly tokenManager: TokenProvider;

  constructor(tokenManager: TokenProvider) {
    this.tokenManager = tokenManager;
  }

  checkAccesKey(requestKey: string): boolean {
    if (!ENV.apiKey) {
      return false;
    }

    if (requestKey === ENV.apiKey) {
      return true;
    }

    return false;
  }

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { authType, accessToken, accessKey, url, method } = request;

      if (accessKey) {
        const hasValidApiKey = this.checkAccesKey(accessKey);

        if (hasValidApiKey) {
          return ok({
            accessToken,
          });
        }

        return unauthenticated();
      }

      if (!accessToken) {
        return forbidden(new Error("Token não providenciado"));
      }

      // checar possibilidade de tratar o error lançado pelo o método verify
      const decodedTokenOrError = await this.tokenManager.verify(accessToken);

      if (decodedTokenOrError) {
        if (decodedTokenOrError.sub) {
          return ok({ accountId: decodedTokenOrError.accountId, accessToken });
        }
      }

      return unauthenticated();
    } catch (error) {
      return forbidden(new Error(`Erro ao realizar autenticação`));
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    url: string;
    method: string;
    accessToken: string;
    accessKey?: string;
    authType: string;
    id?: number;
  };
}
