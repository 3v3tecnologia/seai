import { HttpResponse } from "../controllers/ports";
import { Middleware } from "./ports/middleware";

import { TokenProvider } from "../../domain/use-cases/user/authentication/ports/token-provider";
import { forbidden, ok, unauthenticated } from "../controllers/helpers";
import { AccessKeyRepositoryProtocol } from "../../domain/use-cases/_ports/repositories/acess-key.repository";
import { READ_ONLY_URLs } from "../../server/http/config/readOnlyURLs";

export class AuthMiddleware implements Middleware {
  private readonly tokenManager: TokenProvider;
  private readonly apiKeyRepository: AccessKeyRepositoryProtocol;

  constructor(
    tokenManager: TokenProvider,
    apiKeyRepository: AccessKeyRepositoryProtocol
  ) {
    this.tokenManager = tokenManager;
    this.apiKeyRepository = apiKeyRepository;
  }

  public isReadOnlyURL(method: string, url: string): boolean {
    return (
      method == "GET" &&
      READ_ONLY_URLs.some((readOnlyUrl) => {
        return url.toLocaleLowerCase().includes(readOnlyUrl);
      })
    );
  }

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { authType, accessToken, url, method } = request;

      if (this.isReadOnlyURL(method, url)) {
        const apiKey = await this.apiKeyRepository.getById({
          Id: 1,
        });

        if (apiKey !== null && apiKey.Enabled) {
          const sendedToken = `${authType} ${accessToken}`;
          const apiKeyToken = `${apiKey.Type} ${apiKey.Key}`;

          if (sendedToken === apiKeyToken) {
            return ok({
              accessToken,
            });
          }
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
