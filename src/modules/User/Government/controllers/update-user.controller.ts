import {
  badRequest,
  created,
  forbidden,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { ISchemaValidator } from "../../../../shared/validation/validator";
import { UserType } from "../../core/model/user";
import {
  Modules,
  SystemModulesPermissions,
} from "../../core/model/user-modules-access";
import { UpdateUser } from "../services";

export class UpdateUserController {
  private updateUser: UpdateUser;
  private validator: ISchemaValidator;

  constructor(updateUser: UpdateUser, validator: ISchemaValidator) {
    this.updateUser = updateUser;
    this.validator = validator;
  }

  async handle(request: UpdateUserController.Request): Promise<HttpResponse> {
    try {
      const {
        id,
        email,
        modules,
        login,
        name,
        type,
        confirmPassword,
        password,
      } = request;

      // const { error } = await this.validator.validate({
      //   id,
      //   email,
      //   modules,
      //   login,
      //   name,
      //   type,
      //   confirmPassword,
      //   password,
      // });

      // if (error) {
      //   return badRequest(error);
      // }
      const updateOrError = await this.updateUser.execute({
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
      });

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
