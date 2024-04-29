import { HttpResponse } from "../ports";

import { UserType } from "../../../domain/entities/user/user";
import {
  Modules,
  SystemModulesPermissions,
} from "../../../domain/entities/user/user-modules-access";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { UpdateUser } from "../../../domain/use-cases/user";
import { CommandController } from "../ports/command-controller";
import { created, forbidden, serverError } from "../helpers";

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
      const { id, email, modules } = request;

      const dto = {
        id: Number(id),
        name: Reflect.has(request, "name") ? (request.name as string) : null,
        login: Reflect.has(request, "login") ? (request.login as string) : null,
        email,
        password: Reflect.has(request, "password")
          ? (request.password as string)
          : null,
        confirmPassword: Reflect.has(request, "confirmPassword")
          ? (request.confirmPassword as string)
          : null,
        modules,
        type: request.type,
      };

      const updateOrError = await this.updateUser.execute(dto);

      if (updateOrError.isLeft()) {
        return forbidden(updateOrError.value);
      }

      await this.userLogs.log(request.id, this.updateUser);

      return created(updateOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace UpdateUserController {
  export type Request = {
    id: number;
    email: string;
    type: UserType;
    name: string | null;
    login: string | null;
    password?: string | null;
    confirmPassword?: string | null;
    modules?: {
      [Modules.NEWS]: Required<SystemModulesPermissions>;
      [Modules.REGISTER]: Required<SystemModulesPermissions>;
      [Modules.USER]: Required<SystemModulesPermissions>;
      [Modules.JOBS]: Required<SystemModulesPermissions>;
    };
  };
}
