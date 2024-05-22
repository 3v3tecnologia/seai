import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { DeleteCronUseCaseProtocol } from "../../services";
import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";

export class DeleteCronController
  implements Controller<DeleteCronControllerProtocol.Request, HttpResponse> {
  private useCase: DeleteCronUseCaseProtocol.UseCase;

  constructor(useCase: DeleteCronUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: DeleteCronControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.useCase.execute({
        name: request.name,
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

export namespace DeleteCronControllerProtocol {
  export type Request = {
    accountId: number;
  } & DeleteCronUseCaseProtocol.Request;
}
