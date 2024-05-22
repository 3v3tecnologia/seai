import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { DeleteJobUseCaseProtocol } from "../../services";
import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";

export class DeleteJobController
  implements Controller<DeleteJobControllerProtocol.Request, HttpResponse> {
  private useCase: DeleteJobUseCaseProtocol.UseCase;

  constructor(useCase: DeleteJobUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: DeleteJobControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.useCase.execute({
        id: request.id,
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
export namespace DeleteJobControllerProtocol {
  export type Request = {
    accountId: number;
  } & DeleteJobUseCaseProtocol.Request;
}
