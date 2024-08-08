import { UserRepositoryProtocol } from "../infra/database/repository/protocol/user-repository";

import { Controller } from "../../../../shared/ports/controllers";
import { HttpResponse } from "../../../../shared/ports/http-response";
import { ok, serverError } from "../../../../shared/utils/http-responses";

export class FetchSystemModulesController
  implements Controller<void, HttpResponse>
{
  constructor(private readonly accountRepository: UserRepositoryProtocol) {}

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.accountRepository.getModules();

      return ok(result);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}
