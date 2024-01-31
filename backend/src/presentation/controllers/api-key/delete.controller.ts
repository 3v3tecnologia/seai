import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { DeleteAccessKeyUseCaseProtocol } from "../../../domain/use-cases/access-key";
import { badRequest, ok, serverError } from "../helpers";

export class DeleteAccessKeyController
  implements
    Controller<DeleteAccessKeyControllerProtocol.Request, HttpResponse>
{
  private useCase: DeleteAccessKeyUseCaseProtocol.UseCase;

  constructor(useCase: DeleteAccessKeyUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: DeleteAccessKeyControllerProtocol.Request
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

export namespace DeleteAccessKeyControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
  };
}
