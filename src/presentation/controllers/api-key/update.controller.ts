import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import {
  RegisterAccessKeyUseCaseProtocol,
  UpdateAccessKeyUseCaseProtocol,
} from "../../../domain/use-cases/access-key";
import { badRequest, ok, serverError } from "../helpers";

export class UpdateAccessKeyController
  implements
    Controller<UpdateAccessKeyControllerProtocol.Request, HttpResponse>
{
  private useCase: UpdateAccessKeyUseCaseProtocol.UseCase;

  constructor(useCase: UpdateAccessKeyUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: UpdateAccessKeyControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.useCase.execute({
        Id: request.id,
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

export namespace UpdateAccessKeyControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
  } & Omit<RegisterAccessKeyUseCaseProtocol.Request, "Id">;
}
