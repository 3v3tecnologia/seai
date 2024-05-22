import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchAccessKeyByIdUseCaseProtocol } from "../../services";
import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";

export class FetchAccessKeyByIdController
  implements
  Controller<FetchAccessKeyByIdControllerProtocol.Request, HttpResponse> {
  private useCase: FetchAccessKeyByIdUseCaseProtocol.UseCase;

  constructor(useCase: FetchAccessKeyByIdUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: FetchAccessKeyByIdControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.useCase.execute({
        Id: request.id,
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

export namespace FetchAccessKeyByIdControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
  };
}
