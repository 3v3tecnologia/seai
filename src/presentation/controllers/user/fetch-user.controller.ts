import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { GetUsers } from "../../../domain/use-cases/user/get-users/get-users";
import { ok } from "../helpers";

export class FetchUserController
  implements Controller<FetchUserControllerProtocol.Request, HttpResponse>
{
  private fetchUser: GetUsers;

  constructor(fetchUser: GetUsers) {
    this.fetchUser = fetchUser;
  }

  async handle(
    request: FetchUserControllerProtocol.Request
  ): Promise<HttpResponse> {
    const result = await this.fetchUser.execute({
      userId: request.userId,
    });

    return ok(result.value);
  }
}

export namespace FetchUserControllerProtocol {
  export type Request = {
    userId?: number;
  };
}
