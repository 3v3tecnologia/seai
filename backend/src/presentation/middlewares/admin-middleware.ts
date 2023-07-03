import { HttpResponse } from "../controllers/ports";
import { Middleware } from "./ports/middleware";

import { AccountRepository } from "../../infra/database/postgres/repositories/account-repository";
import { AccessDeniedError } from "../controllers/errors";
import { forbidden, ok, serverError } from "../controllers/helpers";
import { deepEqual } from "../../shared/deepEqual";

function hasAnyKey(obj: any, matcher: any): boolean {
  const ob1 = Object.entries(obj);
  const ob2 = Object.entries(matcher);

  for (const [key, value] of ob2) {
    const result = ob1.some((item) => {
      const [k, v] = item;

      return k === key && value === v;
    });

    if (result === true) {
      return true;
    }
  }
  return false;
}

export class AdminMiddleware implements Middleware {
  private readonly accountRepository: AccountRepository;
  private readonly module: string;
  private readonly access: {
    [key: string]: boolean;
  };

  constructor(
    accountRepository: AccountRepository,
    module: string,
    access: {
      [key: string]: boolean;
    }
  ) {
    this.accountRepository = accountRepository;
    this.module = module;
    this.access = access;
  }

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accountId } = request;

      console.log("request::: ", request);

      if (!accountId) {
        return forbidden(new Error("Invalid id."));
      }

      const module = await this.accountRepository.loadUserModulesByName(
        accountId,
        this.module
      );

      if (module) {
        if (hasAnyKey(module, this.access)) {
          return ok({ accountId });
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
    accountId: number;
  };
}
