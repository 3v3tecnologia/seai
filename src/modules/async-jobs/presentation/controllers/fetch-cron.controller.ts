import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchCronUseCaseProtocol } from "../../services";
import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";
import { formatPaginationInput } from "../../../../shared/core/formatPaginationInput";

export class FetchCronController
  implements Controller<FetchCronControllerProtocol.Request, HttpResponse> {
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
