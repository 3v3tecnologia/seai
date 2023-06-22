import { CreateUser } from "../../../domain/use-cases/user/create-user/create-user";
import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class FetchUserController implements Controller<any> {
  private fetchUser: FetchUser;

  constructor(fetchUser: FetchUser) {
    this.fetchUser = fetchUser;
  }

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    console.log("request = > ", request);
    await this.fetchUser.execute();
    //Add validation here
    return ok({ message: "kkk" });
  }
}

export namespace CreateUserController {
  export type Request = {
    name: string;
    sex: string;
  };
}
