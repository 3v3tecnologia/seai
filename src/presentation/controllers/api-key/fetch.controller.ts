import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchAccessKeyByIdUseCaseProtocol } from "../../../domain/use-cases/access-key";
import { badRequest, ok, serverError } from "../helpers";

export class FetchAccessKeyByIdController
  implements
    Controller<FetchAccessKeyByIdControllerProtocol.Request, HttpResponse>
{
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
