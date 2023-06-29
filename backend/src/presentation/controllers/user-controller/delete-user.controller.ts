import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { DeleteUser } from "../../../domain/use-cases/user/delete-user/delete-user";
import { ok } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class DeleteUserController implements Controller<any> {
  private deleteUser: DeleteUser;

  constructor(deleteUser: DeleteUser) {
    this.deleteUser = deleteUser;
  }

  async handle(request: DeleteUserController.Request): Promise<HttpResponse> {
    console.log("request = > ", request);
    const result = await this.deleteUser.execute(request.id);
    //Add validation here
    return ok({ message: result.value });
  }
}

export namespace DeleteUserController {
  export type Request = {
    id: number;
  };
}
