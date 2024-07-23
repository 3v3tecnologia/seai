import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { AccountRepositoryProtocol } from "../../../modules/User/Government/infra/database/repository/protocol/user-repository";
import { ok, serverError } from "../helpers";

export class FetchSystemModulesController
  implements Controller<void, HttpResponse>
{
  constructor(private readonly accountRepository: AccountRepositoryProtocol) {}

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
