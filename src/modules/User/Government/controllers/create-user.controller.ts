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
import { CreateUser } from "../services";

export class CreateUserController {
  private createUser: CreateUser;
  private validator: ISchemaValidator;

  constructor(createUser: CreateUser, validator: ISchemaValidator) {
    this.createUser = createUser;
    this.validator = validator;
  }

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    try {
      const { email, modules, type } = request;

      const dto = {
        email,
        modules,
        type,
      };

      const { error } = await this.validator.validate(dto);

      if (error) {
        return badRequest(error);
      }

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
