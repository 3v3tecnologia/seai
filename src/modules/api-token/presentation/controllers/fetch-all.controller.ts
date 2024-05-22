import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchAccessKeysUseCaseProtocol } from "../../services";
import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";
import { formatPaginationInput } from "../../../../shared/core/formatPaginationInput";
import { IPaginationInput } from "../../../../shared/core/pagination";

export class FetchAccessKeysController
  implements
  Controller<FetchAccessKeysControllerProtocol.Request, HttpResponse> {
  private useCase: FetchAccessKeysUseCaseProtocol.UseCase;

  constructor(useCase: FetchAccessKeysUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: FetchAccessKeysControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.useCase.execute({
        ...formatPaginationInput(request.pageNumber, request.limit),
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

export namespace FetchAccessKeysControllerProtocol {
  export type Request = IPaginationInput;
}
