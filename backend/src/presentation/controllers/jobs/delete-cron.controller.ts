import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { DeleteCronUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { badRequest, ok, serverError } from "../helpers";

export class DeleteCronController
  implements Controller<DeleteCronControllerProtocol.Request, HttpResponse>
{
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
      return serverError(error as Error);
    }
  }
}

export namespace DeleteCronControllerProtocol {
  export type Request = {
    accountId: number;
  } & DeleteCronUseCaseProtocol.Request;
}
