import { HttpResponse } from "../ports";

import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { CompleteUserRegister, UpdateUser } from "../../../domain/use-cases/user";
import { created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class CompleteUserRegisterController extends CommandController<
  CompleteUserRegisterDTO.Request,
  HttpResponse
> {
  private updateUser: CompleteUserRegister;

  constructor(updateUser: CompleteUserRegister, userLogs: RegisterUserLogs) {
    super(userLogs);
    this.updateUser = updateUser;
  }

  async handle(
    request: CompleteUserRegisterDTO.Request
  ): Promise<HttpResponse> {
    try {
      const dto = {
        id: Number(request.accountId),
        name: request.name,
        login: request.login,
        password: request.password ,
        confirmPassword: request.confirmPassword,
      };

      const updateOrError = await this.updateUser.execute(dto);

      if (updateOrError.isLeft()) {
        return forbidden(updateOrError.value);
      }

      await this.userLogs.log(request.accountId, this.updateUser);

      return created(updateOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace CompleteUserRegisterDTO {
  export type Request = {
    accountId: number;
    name: string;
    login: string;
    password: string;
    confirmPassword: string;
  };
}
