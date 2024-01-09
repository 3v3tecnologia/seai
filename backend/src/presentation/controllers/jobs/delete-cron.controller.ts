import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { DeleteCronUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { ok } from "../helpers";

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
    const result = await this.useCase.execute({
      Name: request.Name,
    });

    return ok(result.value);
  }
}

export namespace DeleteCronControllerProtocol {
  export type Request = {
    accountId: number;
  } & DeleteCronUseCaseProtocol.Request;
}
