import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { DeleteJobUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { ok } from "../helpers";

export class DeleteJobController
  implements Controller<DeleteJobControllerProtocol.Request, HttpResponse>
{
  private useCase: DeleteJobUseCaseProtocol.UseCase;

  constructor(useCase: DeleteJobUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: DeleteJobControllerProtocol.Request
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute({
      Id: request.Id,
    });

    return ok(result.value);
  }
}
export namespace DeleteJobControllerProtocol {
  export type Request = {
    accountId: number;
  } & DeleteJobUseCaseProtocol.Request;
}
