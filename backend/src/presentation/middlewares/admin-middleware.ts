import { HttpResponse } from "../controllers/ports";
import { Middleware } from "./ports/middleware";

import { AccountRepositoryProtocol } from "../../domain/use-cases/_ports/repositories/account-repository";
import {
  forbidden,
  ok,
  serverError,
  unauthorized,
} from "../controllers/helpers";

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
  private readonly accountRepository: AccountRepositoryProtocol;
  private readonly module: string;
  private readonly access: {
    [key: string]: boolean;
  };

  constructor(
    accountRepository: AccountRepositoryProtocol,
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

      if (!accountId) {
        return forbidden(new Error("Identificador do usuário inválido"));
      }

      const module = await this.accountRepository.getUserModulesByName(
        accountId,
        this.module
      );

      if (module) {
        if (hasAnyKey(module, this.access)) {
          return ok({ accountId });
        }
      }

      return unauthorized();
    } catch (error) {
      console.error("[admin-middleware] ", error);
      return serverError(new Error("Error ao verificar autorização."));
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accountId: number;
  };
}
