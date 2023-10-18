import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { GetUsers } from "../../../domain/use-cases/user/get-users/get-users";
import { ok } from "../helpers";

export class FetchUserController
  implements Controller<CreateUserController.Request, HttpResponse>
{
  private fetchUser: GetUsers;

  constructor(fetchUser: GetUsers) {
    this.fetchUser = fetchUser;
  }

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    const result = await this.fetchUser.execute(request);

    return ok(result.value);
  }
}

export namespace CreateUserController {
  export type Request = {
    userId?: number;
  };
}
