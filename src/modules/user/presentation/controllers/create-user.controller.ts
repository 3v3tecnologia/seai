import { CommandController } from "../../../../shared/presentation/command-controller";
import { HttpResponse, created, forbidden, serverError } from "../../../../shared/presentation/http-responses";
import { RegisterUserLogs } from "../../../logs/services";
import { UserType } from "../../core/model/user";
import { Modules, SystemModulesPermissions } from "../../core/model/user-modules-access";
import { CreateUser } from "../../use-cases";

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
    type: UserType;
    code: string;
    modules: {
      [Modules.NEWS]: Required<SystemModulesPermissions>;
      [Modules.REGISTER]: Required<SystemModulesPermissions>;
      [Modules.USER]: Required<SystemModulesPermissions>;
      [Modules.JOBS]: Required<SystemModulesPermissions>;
    };
  };
}
