import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchCronUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { ok } from "../helpers";

export class FetchJobsStatesController
  implements
    Controller<FetchJobsStatesControllerProtocol.Request, HttpResponse>
{
  private useCase: FetchCronUseCaseProtocol.UseCase;

  constructor(useCase: FetchCronUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: FetchJobsStatesControllerProtocol.Request
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute({
      limit: request.limit,
      pageNumber: request.pageNumber,
      Queue: request.Queue,
    });

    return ok(result.value);
  }
}

export namespace FetchJobsStatesControllerProtocol {
  export type Request = FetchCronUseCaseProtocol.Request;
}
