import { Middleware } from "./middleware";

import ENV from "../../server/http/env";
import { TokenProvider } from "../../domain/User/infra/token-provider";
import { HttpResponse } from "../ports/http-response";
import { forbidden, ok, unauthenticated } from "../utils/http-responses";

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
      const { accessToken, accessKey } = request;

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
