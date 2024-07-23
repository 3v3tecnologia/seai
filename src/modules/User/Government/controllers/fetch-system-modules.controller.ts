import { AccountRepositoryProtocol } from "../infra/database/repository/protocol/user-repository";
import { ok, serverError } from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { Controller } from "../../../../presentation/controllers/ports/controllers";

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
