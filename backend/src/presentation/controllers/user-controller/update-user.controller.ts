import { CreateUser } from "../../../domain/use-cases/user/create-user/create-user";
import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class UpdateUserController implements Controller<any> {
  private updateUser: UpdateUser;

  constructor(updateUser: UpdateUser) {
    this.updateUser = updateUser;
  }

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    console.log("request = > ", request);
    await this.updateUser.execute();
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
