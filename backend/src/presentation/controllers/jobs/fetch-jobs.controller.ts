import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import {
  FetchCronUseCaseProtocol,
  FetchJobUseCaseProtocol,
} from "../../../domain/use-cases/jobs";
import { badRequest, ok, serverError } from "../helpers";

export class FetchJobsController
  implements Controller<FetchJobsControllerProtocol.Request, HttpResponse>
{
  private useCase: FetchJobUseCaseProtocol.UseCase;

  constructor(useCase: FetchJobUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: FetchJobsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.useCase.execute({
        id: request.id,
        limit: request.limit,
        pageNumber: request.pageNumber,
        queue: request.queue,
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

export namespace FetchJobsControllerProtocol {
  export type Request = { id?: string } & Omit<
    FetchCronUseCaseProtocol.Request,
    "Id"
  >;
}
