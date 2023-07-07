import { HttpResponse } from "../ports";

import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { DeleteUser } from "../../../domain/use-cases/user/delete-user/delete-user";
import { forbidden, ok } from "../helpers";
import { CommandController } from "../ports/command-controller";

// Controllers são classes puras e não devem depender de frameworks
export class DeleteUserController extends CommandController<
  DeleteUserController.Request,
  HttpResponse
> {
  private deleteUser: DeleteUser;

  constructor(deleteUser: DeleteUser, userLogs: RegisterUserLogs) {
    super(userLogs);
    this.deleteUser = deleteUser;
  }

  async handle(request: DeleteUserController.Request): Promise<HttpResponse> {
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
