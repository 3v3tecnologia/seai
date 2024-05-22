import { HttpResponse } from "../controllers/ports";
import { Middleware } from "./ports/middleware";

import { TokenProvider } from "../../domain/use-cases/user/authentication/ports/token-provider";
import { forbidden, ok, unauthenticated } from "../controllers/helpers";
import { AccessKeyRepositoryProtocol } from "../../domain/use-cases/_ports/repositories/acess-key.repository";
import { READ_ONLY_URLs } from "../../server/http/config/readOnlyURLs";
import { left } from "../../shared/Either";

export class AuthMiddleware implements Middleware {
  private readonly tokenManager: TokenProvider;
  private readonly apiKeyRepository: AccessKeyRepositoryProtocol;
  private static openURLs = new Set(['faq', 'equipments', 'news'])

  constructor(
    tokenManager: TokenProvider,
    apiKeyRepository: AccessKeyRepositoryProtocol
  ) {
    this.tokenManager = tokenManager;
    this.apiKeyRepository = apiKeyRepository;
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

  async checkAPIKey(accessToken: string): Promise<boolean> {
    const apiKey = await this.apiKeyRepository.getByKey({
      Key: accessToken,
    });

    if (apiKey === null) {
      return false
    }

    return true
  }

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { authType, accessToken, url, method } = request;

      if (this.allowedToOpenAccess(method, url)) {
        const hasValidApiKey = await this.checkAPIKey(accessToken)

        if (hasValidApiKey) {
          return ok({
            accessToken,
          });
        }
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
    authType: string;
    id?: number;
  };
}
