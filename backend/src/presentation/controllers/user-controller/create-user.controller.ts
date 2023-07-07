import { CreateUser } from "../../../domain/use-cases/user/create-user/create-user";
import { HttpResponse } from "../ports";

import { RegisterUserLogs } from "../../../domain/use-cases/logs/register-user-logs";
import { Validator } from "../../../shared/validation/ports/validator";
import { badRequest, created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

// Controllers são classes puras e não devem depender de frameworks
export class CreateUserController extends CommandController<
  CreateUserController.Request,
  HttpResponse
> {
  private createUser: CreateUser;
  private validator: Validator;

  constructor(
    createUser: CreateUser,
    validator: Validator,
    userLogs: RegisterUserLogs
  ) {
    super(userLogs);
    this.createUser = createUser;
    this.validator = validator;
  }

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    try {
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
