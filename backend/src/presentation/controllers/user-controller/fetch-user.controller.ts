import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { GetUsers } from "../../../domain/use-cases/user/get-users/get-users";
import { ok } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class FetchUserController
  implements Controller<CreateUserController.Request, HttpResponse>
{
  private fetchUser: GetUsers;

  constructor(fetchUser: GetUsers) {
    this.fetchUser = fetchUser;
  }

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    const result = await this.fetchUser.execute();
    //Add validation here
    return ok(result.value);
  }
}

export namespace CreateUserController {
  export type Request = {
    name: string;
  };
}
