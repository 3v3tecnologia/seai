import { CreateUser } from "../../../domain/use-cases/user/create-user/create-user";
import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class CreateUserController implements Controller<any> {
  private createUser: CreateUser;

  constructor(createUser: CreateUser) {
    this.createUser = createUser;
  }

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    console.log("request = > ", request);
    await this.createUser.create();
    //Add validation here
    return ok({ message: "kkk" });
  }
}

export namespace CreateUserController {
  export type Request = {
    email: string;
    type: string;
    modules: Array<string>;
  };
}
