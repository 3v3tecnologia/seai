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
      const dto = {
        data: request.data,
        name: request.name,
        priority: request.priority,
        retryDelay: request.retryDelay,
        retryLimit: request.retryLimit,
      };

      if (request.state) {
        Object.assign(dto, {
          state: request.state,
        });
      }

      if (request.startAfter) {
        Object.assign(dto, {
          startAfter: request.startAfter,
        });
      }

      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        return badRequest(result.value);
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace CreateJobControllerProtocol {
  export type Request = {
    accountId: number;
  } & CreateJobUseCaseProtocol.Request;
}
