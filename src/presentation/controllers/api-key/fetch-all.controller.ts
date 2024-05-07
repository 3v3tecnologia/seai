import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchAccessKeysUseCaseProtocol } from "../../../domain/use-cases/access-key";
import { badRequest, ok, serverError } from "../helpers";
import { formatPaginationInput } from "../../../domain/use-cases/helpers/formatPaginationInput";
import { IPaginationInput } from "../../../domain/use-cases/helpers/pagination";

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
