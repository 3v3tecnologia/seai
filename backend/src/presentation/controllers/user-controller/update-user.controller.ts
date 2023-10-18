import { HttpResponse } from "../ports";

import { UserType } from "../../../domain/entities/user/user";
import {
  Modules,
  SystemModulesPermissions,
} from "../../../domain/entities/user/user-modules-access";
import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { UpdateUser } from "../../../domain/use-cases/user/update-user";
import { created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class UpdateUserController extends CommandController<
  UpdateUserController.Request,
  HttpResponse
> {
  private updateUser: UpdateUser;

  constructor(updateUser: UpdateUser, userLogs: RegisterUserLogs) {
    super(userLogs);
    this.updateUser = updateUser;
  }

  async handle(request: UpdateUserController.Request): Promise<HttpResponse> {
    try {
      const {
        accountId,
        email,
        modules,
        type,
        name,
        password,
        confirmPassword,
        login,
      } = request;

      console.log("Update user controller : ", request);

      const dto = {
        id: accountId,
        name,
        login,
        email,
        password,
        confirmPassword,
        modules,
      };

      if (type) {
        Object.assign(dto, {
          type,
        });
      }

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

export namespace UpdateUserController {
  export type Request = {
    accountId: number;
    email: string;
    type?: UserType;
    name: string;
    login: string;
    password?: string;
    confirmPassword?: string;
    modules?: {
      [Modules.NEWS]: Required<SystemModulesPermissions>;
      [Modules.REGISTER]: Required<SystemModulesPermissions>;
      [Modules.USER]: Required<SystemModulesPermissions>;
    };
  };
}
