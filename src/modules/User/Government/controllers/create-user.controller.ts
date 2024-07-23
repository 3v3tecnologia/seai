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
import { CreateUser } from "../services";

export class CreateUserController {
  private createUser: CreateUser;

  constructor(createUser: CreateUser) {
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
    type: UserType;
    code: string;
    modules: {
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
