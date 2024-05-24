import { CommandController } from "../../../../shared/presentation/command-controller";
import { HttpResponse, forbidden, ok } from "../../../../shared/presentation/http-responses";
import { RegisterUserLogs } from "../../../system-logs/services";
import { DeleteUser } from "../../use-cases";
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
    const dto = {
      id: Reflect.has(request, 'id') ? request.id : request.accountId,
    };

    console.log(dto);

    if (request.email) {
      Object.assign(dto, {
        email: request.email,
      });
    }

    if ([Reflect.has(dto, 'id'), Reflect.has(dto, 'email')].every((c => c == false))) {
      return forbidden(new Error("Necessário informar a identificação do usuário"))
    }

    const result = await this.deleteUser.execute(dto);

    if (result.isLeft()) {
      return forbidden(result.value);
    }
    await this.userLogs.log(request.accountId, this.deleteUser);
    return ok(result.value);
  }
}

export namespace DeleteUserController {
  export type Request = {
    accountId: number;
    id: number;
    email?: string;
  };
}
