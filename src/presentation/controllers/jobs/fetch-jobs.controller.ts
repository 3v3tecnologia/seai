import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import {
  FetchCronUseCaseProtocol,
  FetchJobUseCaseProtocol,
} from "../../../domain/use-cases/jobs";
import { badRequest, ok, serverError } from "../helpers";
import { parsePaginationInput } from "../../../domain/use-cases/helpers/pagination";

export class FetchJobsController
  implements Controller<FetchJobsControllerProtocol.Request, HttpResponse> {
  private useCase: FetchJobUseCaseProtocol.UseCase;

  constructor(useCase: FetchJobUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: FetchJobsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const dto = {
        id: request.id,
        ...parsePaginationInput({
          page: request.pageNumber,
          limit: request.limit
        }),
      }

      if (request.queue)
        Object.assign(dto, {
          queue: request.queue,
        });

      if (request.state)
        Object.assign(dto, {
          queue: request.state,
        });

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

export namespace FetchJobsControllerProtocol {
  export type Request = { id?: string, queue?: string; state?: string } & Omit<
    FetchCronUseCaseProtocol.Request,
    "id"
  >;
}
