import { CreateUser } from "../../../domain/use-cases/user/create-user/create-user";
import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { badRequest, created, forbidden, ok, serverError } from "../helpers";
import { CreateUserDTO } from "../../../domain/use-cases/user/create-user/ports";
import { Validator } from "../../../shared/validation/ports/validator";
import { RegisterUserLogs } from "../../../domain/use-cases/logs/register-user-logs";

// Controllers são classes puras e não devem depender de frameworks
export class CreateUserController implements Controller {
  private createUser: CreateUser;
  private validator: Validator;
  private userLogs: RegisterUserLogs;

  constructor(
    createUser: CreateUser,
    validator: Validator,
    userLogs: RegisterUserLogs
  ) {
    this.createUser = createUser;
    this.validator = validator;
    this.userLogs = userLogs;
  }

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    try {
      console.log("CreateUserController = request ::: ", request);

      const error = this.validator.validate(request);

      if (error.isLeft()) {
        return badRequest(error.value);
      }

      const { email, modules, type } = request;

      const createdOrError = await this.createUser.create({
        email,
        modules,
        type,
      });

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }
      await this.userLogs.log(request.accountId, this.createUser.useCaseLogs());
      //Add validation here
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
    type: "admin" | "standard";
    modules: {
      news_manager: {
        read: boolean;
        write: boolean;
      };
      registers: {
        read: boolean;
        write: boolean;
      };
      users_manager: {
        read: boolean;
        write: boolean;
      };
    };
  };
}
