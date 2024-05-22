import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import {
  FetchCronUseCaseProtocol,
  FetchJobsStatesUseCaseProtocol,
} from "../../services";
import { ok, serverError } from "../../../../presentation/controllers/helpers";

export class FetchJobsStatesController
  implements
  Controller<FetchJobsStatesControllerProtocol.Request, HttpResponse> {
  private useCase: FetchJobsStatesUseCaseProtocol.UseCase;

  constructor(useCase: FetchJobsStatesUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.useCase.execute();

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace FetchJobsStatesControllerProtocol {
  export type Request = FetchCronUseCaseProtocol.Request;
}
