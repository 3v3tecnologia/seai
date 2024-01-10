import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { UpdateCronUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { ok } from "../helpers";

export class UpdateCronController
  implements Controller<UpdateCronControllerProtocol.Request, HttpResponse>
{
  private useCase: UpdateCronUseCaseProtocol.UseCase;

  constructor(useCase: UpdateCronUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: UpdateCronControllerProtocol.Request
  ): Promise<HttpResponse> {
    const result = await this.useCase.execute({
      Cron: request.Cron,
      Data: request.Data || null,
      Name: request.Name,
      Option: request.Option || null,
      Timezone: request.Timezone || null,
    });

    return ok(result.value);
  }
}

namespace UpdateCronControllerProtocol {
  export type Request = {
    accountId: number;
  } & Omit<UpdateCronUseCaseProtocol.Request, "Id">;
}
