import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { RegisterAccessKeyUseCaseProtocol } from "../../services";
import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";

export class RegisterAccessKeyController
  implements
  Controller<RegisterAccessKeyControllerProtocol.Request, HttpResponse> {
  private useCase: RegisterAccessKeyUseCaseProtocol.UseCase;

  constructor(useCase: RegisterAccessKeyUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: RegisterAccessKeyControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.useCase.execute({
        Key: request.Key,
        Type: request.Type,
        Enabled: request.Enabled,
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

export namespace RegisterAccessKeyControllerProtocol {
  export type Request = {
    accountId: number;
  } & Omit<RegisterAccessKeyUseCaseProtocol.Request, "Id">;
}
