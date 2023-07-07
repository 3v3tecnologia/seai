import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { DeleteUser } from "../../../domain/use-cases/user/delete-user/delete-user";
import { forbidden, ok } from "../helpers";
import { RegisterUserLogs } from "../../../domain/use-cases/logs/register-user-logs";

// Controllers são classes puras e não devem depender de frameworks
export class DeleteUserController implements Controller<any> {
  private deleteUser: DeleteUser;
  private userLogs: RegisterUserLogs;

  constructor(deleteUser: DeleteUser, userLogs: RegisterUserLogs) {
    this.deleteUser = deleteUser;
    this.userLogs = userLogs;
  }

  async handle(request: DeleteUserController.Request): Promise<HttpResponse> {
    console.log("request = > ", request);
    const result = await this.deleteUser.execute(request.id);

    if (result.isLeft()) {
      return forbidden(result.value);
    }
    await this.userLogs.log(request.accountId, this.deleteUser.useCaseLogs());
    //Add validation here
    return ok(result.value);
  }
}

export namespace DeleteUserController {
  export type Request = {
    accountId: number;
    id: number;
  };
}
