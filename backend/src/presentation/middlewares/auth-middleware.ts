import { HttpResponse } from "../controllers/ports";
import { Middleware } from "./ports/middleware";

import { AccessDeniedError } from "../controllers/errors";
import { forbidden, ok, serverError } from "../controllers/helpers";
import { FetchUserAccountByTokenUseCase } from "../../domain/use-cases/user/fetch-user-account-by-token/fetch-user-account-by-token";

export class AuthMiddleware implements Middleware {
  private readonly fetchUserAccountByToken: FetchUserAccountByTokenUseCase;
  private readonly role?: string;

  constructor(
    fetchUserAccountByToken: FetchUserAccountByTokenUseCase,
    role?: string
  ) {
    this.fetchUserAccountByToken = fetchUserAccountByToken;
    this.role = role;
  }

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request;

      if (accessToken) {
        const account = await this.fetchUserAccountByToken.load(
          accessToken,
          this.role
        );

        if (account) {
          return ok({ accountId: account.id });
        }
      }

      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string;
  };
}
