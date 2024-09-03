import { Middleware } from "../../../../shared/middlewares/middleware";
import { HttpResponse } from "../../../../shared/ports/http-response";
import {
  forbidden,
  ok,
  serverError,
  unauthorized,
} from "../../../../shared/utils/http-responses";
import { UserRepositoryProtocol } from "../infra/database/repository/protocol/user-repository";

export class AdminMiddleware implements Middleware {
  private readonly accountRepository: UserRepositoryProtocol;

  constructor(accountRepository: UserRepositoryProtocol) {
    this.accountRepository = accountRepository;
  }

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accountId } = request;

      if (!accountId) {
        return forbidden(new Error("Identificador do usuário inválido"));
      }

      const userAccount = await this.accountRepository.getById(accountId);

      if (userAccount == null || userAccount.type != "admin")
        return unauthorized();

      return ok({ accountId });
    } catch (error) {
      return serverError(new Error("Error ao verificar autorização."));
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accountId: number;
  };
}