import { Controller } from "../../../../shared/presentation/controllers";
import { HttpResponse, forbidden, serverError, ok } from "../../../../shared/presentation/http-responses";
import { FetchUserById } from "../../use-cases";

export class FetchUserByIdController
  implements Controller<FetchUserByIdControllerProtocol.Request, HttpResponse> {
  private loadUser: FetchUserById;

  constructor(loadUser: FetchUserById) {
    this.loadUser = loadUser;
  }

  async handle(
    request: FetchUserByIdControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const dto = {
        userId: request.id || request.accountId,
      };
      const result = await this.loadUser.execute(dto);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchUserByIdControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
  };
}
