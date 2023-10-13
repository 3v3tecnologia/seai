import { CreateUser } from "../../../domain/use-cases/user/create-user/create-user";
import { HttpResponse } from "../ports";

import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";
import {
  Modules,
  PermissionType,
  SystemModulesPermissions,
} from "../../../domain/entities/user/user-modules-access";

export class CreateUserController extends CommandController<
  CreateUserController.Request,
  HttpResponse
> {
  private createUser: CreateUser;

  constructor(createUser: CreateUser, userLogs: RegisterUserLogs) {
    super(userLogs);
    this.createUser = createUser;
  }

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    try {
      const { email, modules, type } = request;

      const dto = {
        email,
        modules,
        type,
      };

      const createdOrError = await this.createUser.create(dto);

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      await this.userLogs.log(request.accountId, this.createUser);

      return created(createdOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace CreateUserController {
  export type Request = {
    accountId: number;
    email: string;
    type: PermissionType;
    modules: {
      [Modules.NEWS]: Required<SystemModulesPermissions>;
      [Modules.REGISTER]: Required<SystemModulesPermissions>;
      [Modules.USER]: Required<SystemModulesPermissions>;
    };
  };
}
