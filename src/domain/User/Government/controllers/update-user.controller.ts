import { UserOperationControllerDTO } from "../../../../@types/login-user";
import { ISchemaValidator } from "../../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../../shared/ports/http-response";
import {
  badRequest,
  created,
  forbidden,
  serverError,
} from "../../../../shared/utils/http-responses";

import { UserType } from "../../core/model/user";
import {
  Modules,
  SystemModulesPermissions,
} from "../../core/model/user-modules-access";
import { IUpdateUserUseCase, UpdateUser } from "../services";

export class UpdateUserController {
  private updateUser: IUpdateUserUseCase;
  private validator: ISchemaValidator;

  constructor(updateUser: IUpdateUserUseCase, validator: ISchemaValidator) {
    this.updateUser = updateUser;
    this.validator = validator;
  }

  async handle(request: UpdateUserController.Request): Promise<HttpResponse> {
    try {
      const { id, email, login, name, modules, type, Operation, accountId } =
        request;

      const { error } = await this.validator.validate({
        id,
        email,
        modules,
        type,
        name,
        login,
        accountId,
        Operation,
      });

      if (error) {
        return badRequest(error);
      }

      const updateOrError = await this.updateUser.execute(
        {
          id: Number(id),
          email,
          modules,
          type,
          name,
          login,
        },
        {
          author: accountId,
          operation: Operation,
        }
      );

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
    name: string;
    login: string;
    type: UserType;
    modules: {
      [Modules.USER]: Required<SystemModulesPermissions>;
      [Modules.EQUIPMENTS]: Required<SystemModulesPermissions>;
      [Modules.CROP]: Required<SystemModulesPermissions>;
      [Modules.FAQ]: Required<SystemModulesPermissions>;
      [Modules.NEWSLETTER]: Required<SystemModulesPermissions>;
      [Modules.STUDIES]: Required<SystemModulesPermissions>;
      [Modules.WEIGHTS]: Required<SystemModulesPermissions>;
    };
  } & UserOperationControllerDTO;
}
