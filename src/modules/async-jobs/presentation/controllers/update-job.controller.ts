import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { UpdateJobUseCaseProtocol } from "../../services";
import { badRequest, ok, serverError } from "../../../../presentation/controllers/helpers";

export class UpdateJobController
  implements Controller<UpdateJobControllerProtocol.Request, HttpResponse> {
  private useCase: UpdateJobUseCaseProtocol.UseCase;

  constructor(useCase: UpdateJobUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: UpdateJobControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const dto = {
        id: request.id,
        data: request.data,
        name: request.name,
        priority: request.priority,
        retryDelay: request.retryDelay,
        retryLimit: request.retryLimit,
      };

      if (request.state) {
        Object.assign(dto, {
          state: request.state,
        });
      }

      if (request.startAfter) {
        Object.assign(dto, {
          startAfter: request.startAfter,
        });
      }


      console.log("[UpdateJobDTO] - ", dto)
      const result = await this.useCase.execute(dto);

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

export namespace UpdateJobControllerProtocol {
  export type Request = {
    accountId: number;
    id: string;
  } & Omit<UpdateJobUseCaseProtocol.Request, "id">;
}
