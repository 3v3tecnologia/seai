import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import {
  FetchCronUseCaseProtocol,
  FetchJobsStatesUseCaseProtocol,
} from "../../../domain/use-cases/jobs";
import { ok } from "../helpers";

export class FetchJobsStatesController
  implements
    Controller<FetchJobsStatesControllerProtocol.Request, HttpResponse>
{
  private useCase: FetchJobsStatesUseCaseProtocol.UseCase;

  constructor(useCase: FetchJobsStatesUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(): Promise<HttpResponse> {
    const result = await this.useCase.execute();

    return ok(result.value);
  }
}

export namespace FetchJobsStatesControllerProtocol {
  export type Request = FetchCronUseCaseProtocol.Request;
}
