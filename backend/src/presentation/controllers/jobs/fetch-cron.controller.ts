import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchCronUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { ok } from "../helpers";

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
    const result = await this.useCase.execute({
      limit: request.limit,
      pageNumber: request.pageNumber,
      Queue: request.Queue,
    });

    return ok(result.value);
  }
}

export namespace FetchCronControllerProtocol {
  export type Request = FetchCronUseCaseProtocol.Request;
}
