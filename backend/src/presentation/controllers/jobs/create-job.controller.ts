import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { CreateJobUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { badRequest, ok, serverError } from "../helpers";

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
    try {
      const result = await this.useCase.execute({
        queue: request.queue,
        data: request.data || null,
        priority: request.priority || 2,
        retryDelay: request.retryDelay || 60,
        retryLimit: request.retryLimit || 3,
      });

      if (result.isLeft()) {
        return badRequest(result.value);
      }

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace CreateJobControllerProtocol {
  export type Request = {
    accountId: number;
  } & CreateJobUseCaseProtocol.Request;
}
