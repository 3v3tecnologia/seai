import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import {
  FetchCronUseCaseProtocol,
  FetchJobUseCaseProtocol,
} from "../../../domain/use-cases/jobs";
import { ok } from "../helpers";

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
    const result = await this.useCase.execute({
      Id: request.id,
      limit: request.limit,
      pageNumber: request.pageNumber,
      Queue: request.Queue,
    });

    return ok(result.value);
  }
}

export namespace FetchJobsControllerProtocol {
  export type Request = { id?: string } & Omit<
    FetchCronUseCaseProtocol.Request,
    "Id"
  >;
}
