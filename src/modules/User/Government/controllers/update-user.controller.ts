import {
  created,
  forbidden,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { UserType } from "../model/user";
import {
  Modules,
  SystemModulesPermissions,
} from "../model/user-modules-access";
import { UpdateUser } from "../services";

export class UpdateUserController {
  private updateUser: UpdateUser;

  constructor(updateUser: UpdateUser) {
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
      [Modules.USER]: Required<SystemModulesPermissions>;
      [Modules.EQUIPMENTS]: Required<SystemModulesPermissions>;
      [Modules.CROP]: Required<SystemModulesPermissions>;
      [Modules.FAQ]: Required<SystemModulesPermissions>;
      [Modules.NEWSLETTER]: Required<SystemModulesPermissions>;
      [Modules.STUDIES]: Required<SystemModulesPermissions>;
      [Modules.WEIGHTS]: Required<SystemModulesPermissions>;
    };
  };
}
