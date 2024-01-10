import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { CreateJobUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { ok } from "../helpers";

export class CreateJobController
  implements Controller<CreateJobControllerProtocol.Request, HttpResponse>
{
  private useCase: CreateJobUseCaseProtocol.UseCase;

  constructor(useCase: CreateJobUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: CreateJobControllerProtocol.Request
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute({
      Queue: request.Queue,
      Data: request.Data || null,
      Priority: request.Priority || 2,
      RetryDelay: request.RetryDelay || 60,
      RetryLimit: request.RetryLimit || 3,
    });

    return ok(result.value);
  }
}

export namespace CreateJobControllerProtocol {
  export type Request = {
    accountId: number;
  } & CreateJobUseCaseProtocol.Request;
}
