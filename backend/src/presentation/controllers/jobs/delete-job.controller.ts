import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { DeleteJobUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { badRequest, ok, serverError } from "../helpers";

export class DeleteJobController
  implements Controller<DeleteJobControllerProtocol.Request, HttpResponse>
{
  private useCase: DeleteJobUseCaseProtocol.UseCase;

  constructor(useCase: DeleteJobUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: DeleteJobControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.useCase.execute({
        Id: request.Id,
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
export namespace DeleteJobControllerProtocol {
  export type Request = {
    accountId: number;
  } & DeleteJobUseCaseProtocol.Request;
}
