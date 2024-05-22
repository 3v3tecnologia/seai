import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { DeleteAccessKeyUseCaseProtocol } from "../../services";
import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";

export class DeleteAccessKeyController
  implements
  Controller<DeleteAccessKeyControllerProtocol.Request, HttpResponse> {
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
