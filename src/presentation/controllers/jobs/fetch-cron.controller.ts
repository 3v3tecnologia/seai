import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchCronUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { badRequest, ok, serverError } from "../helpers";
import { formatPaginationInput } from "../../../domain/use-cases/helpers/formatPaginationInput";

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
        ...formatPaginationInput(request.pageNumber, request.limit),
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
