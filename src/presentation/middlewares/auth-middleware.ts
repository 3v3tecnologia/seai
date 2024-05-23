import { HttpResponse } from "../controllers/ports";
import { Middleware } from "./ports/middleware";

import { TokenProvider } from "../../domain/use-cases/user/authentication/ports/token-provider";
import ENV from '../../server/http/env';
import { forbidden, ok, unauthenticated } from "../controllers/helpers";
export class AuthMiddleware implements Middleware {
  private readonly tokenManager: TokenProvider;
  private static openURLs = new Set(['faq', 'equipments', 'news'])

  constructor(
    tokenManager: TokenProvider
  ) {
    this.tokenManager = tokenManager;
  }


  public allowedToOpenAccess(method: string, url: string): boolean {
    let authorized = false

    AuthMiddleware.openURLs.forEach((allowedURL) => {
      if (url.includes(allowedURL) && method === 'GET') {
        authorized = true
        return
      }
    })

    return authorized
  }

  checkAccesKey(requestKey: string, method: string, url: string): boolean {
    if (!ENV.apiKey) {
      return false
    }

    if (requestKey === ENV.apiKey && this.allowedToOpenAccess(method, url)) {
      return true
    }

    return false
  }

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { authType, accessToken, accessKey, url, method } = request;

      if (accessKey) {
        const hasValidApiKey = this.checkAccesKey(accessKey, method, url)

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
      console.error("[auth-middleware] ", error);
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
