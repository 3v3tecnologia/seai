import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchCronUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { badRequest, ok, serverError } from "../helpers";

export class FetchCronController
  implements Controller<FetchCronControllerProtocol.Request, HttpResponse>
{
  private useCase: FetchCronUseCaseProtocol.UseCase;

  constructor(useCase: FetchCronUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: FetchCronControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.useCase.execute({
        limit: request.limit,
        pageNumber: request.pageNumber ? Number(request.pageNumber) : 1,
        queue: request.queue,
      });

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

export namespace FetchCronControllerProtocol {
  export type Request = FetchCronUseCaseProtocol.Request;
}