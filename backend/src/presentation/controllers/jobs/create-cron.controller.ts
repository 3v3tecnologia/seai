import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { CreateCronUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { badRequest, ok, serverError } from "../helpers";

export class CreateCronController
  implements Controller<CreateCronControllerProtocol.Request, HttpResponse>
{
  private useCase: CreateCronUseCaseProtocol.UseCase;

  constructor(useCase: CreateCronUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: CreateCronControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.useCase.execute({
        Cron: request.Cron,
        Data: request.Data,
        Name: request.Name,
        Option: request.Option,
        Timezone: request.Timezone,
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

export namespace CreateCronControllerProtocol {
  export type Request = {
    accountId: number;
  } & CreateCronUseCaseProtocol.Request;
}
