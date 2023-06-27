import { HttpResponse } from "../controllers/ports";
import { Middleware } from "./ports/middleware";

import { AccountRepository } from "../../infra/database/postgres/repositories/account-repository";
import { AccessDeniedError } from "../controllers/errors";
import { forbidden, ok, serverError } from "../controllers/helpers";

export class AdminMiddleware implements Middleware {
  private readonly accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accountId } = request;

      console.log("request::: ", request);

      if (!accountId) {
        return forbidden(new Error("Invalid id."));
      }

      const account = await this.accountRepository.loadById(accountId);

      if (account?.type === "admin") {
        return ok({ accountId });
      }

      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accountId: number;
  };
}
