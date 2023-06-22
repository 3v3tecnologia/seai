import { CreateUser } from "../../../domain/use-cases/user/create-user/create-user";
import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class DeleteUserController implements Controller<any> {
  private deleteUser: DeleteUser;

  constructor(deleteUser: DeleteUser) {
    this.deleteUser = deleteUser;
  }

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    console.log("request = > ", request);
    await this.deleteUser.execute();
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
