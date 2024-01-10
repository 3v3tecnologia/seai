import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { UpdateJobUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { ok } from "../helpers";

export class UpdateJobController
  implements Controller<UpdateJobControllerProtocol.Request, HttpResponse>
{
  private useCase: UpdateJobUseCaseProtocol.UseCase;

  constructor(useCase: UpdateJobUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: UpdateJobControllerProtocol.Request
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute({
      Id: request.id,
      Data: request.Data,
      Queue: request.Queue,
      Priority: request.Priority,
      RetryDelay: request.RetryDelay,
      RetryLimit: request.RetryLimit,
    });

    return ok(result.value);
  }
}

export namespace UpdateJobControllerProtocol {
  export type Request = {
    accountId: number;
    id: string;
  } & Omit<UpdateJobUseCaseProtocol.Request, "Id">;
}
