import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchUserById } from "../../../domain/use-cases/user/fetch-user-by-id/fetch-user-by-id";
import { forbidden, ok, serverError } from "../helpers";

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
