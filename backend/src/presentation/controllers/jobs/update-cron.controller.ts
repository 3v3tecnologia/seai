import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { UpdateCronUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { badRequest, ok, serverError } from "../helpers";

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
    try {
      const result = await this.useCase.execute({
        Cron: request.Cron,
        Data: request.Data || null,
        Name: request.Name,
        Option: request.Option || null,
        Timezone: request.Timezone || null,
      });
  
      if(result.isLeft()){
        return badRequest(result.value)
      }
  
      return ok(result.value);
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

namespace UpdateCronControllerProtocol {
  export type Request = {
    accountId: number;
  } & Omit<UpdateCronUseCaseProtocol.Request, "Id">;
}
