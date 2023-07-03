import { HttpResponse } from "../controllers/ports";
import { Middleware } from "./ports/middleware";

import { TokenProvider } from "../../domain/use-cases/user/authentication/ports/token-provider";
import { AccessDeniedError } from "../controllers/errors";
import { forbidden, ok, serverError } from "../controllers/helpers";

export class AuthMiddleware implements Middleware {
  private readonly tokenManager: TokenProvider;

  constructor(tokenManager: TokenProvider) {
    this.tokenManager = tokenManager;
  }

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request;

      if (!accessToken) {
        return forbidden(new Error("Invalid token"));
      }

      // checar possibilidade de tratar o error lançado pelo o método verify
      const decodedTokenOrError = await this.tokenManager.verify(accessToken);

      if (decodedTokenOrError) {
        if (decodedTokenOrError.sub) {
          return ok({ accountId: decodedTokenOrError.accountId });
        }
      }

      return forbidden(new AccessDeniedError());
    } catch (error) {
      console.error("[auth-middleware] ", error);
      return serverError(error as Error);
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken: string;
    id?: number;
  };
}
