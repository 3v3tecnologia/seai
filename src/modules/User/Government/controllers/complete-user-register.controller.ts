import {
  created,
  forbidden,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { CompleteUserRegister } from "../services";

export class CompleteUserRegisterController {
  private updateUser: CompleteUserRegister;

  constructor(updateUser: CompleteUserRegister) {
    this.updateUser = updateUser;
  }

  async handle(
    request: CompleteUserRegisterDTO.Request
  ): Promise<HttpResponse> {
    try {
      const updateOrError = await this.updateUser.execute({
        code: request.code,
        name: request.name,
        login: request.login,
        password: request.password,
        confirmPassword: request.confirmPassword,
      });

      if (updateOrError.isLeft()) {
        return forbidden(updateOrError.value);
      }

      // await this.userLogs.log(request.accountId, this.updateUser);

      return created(updateOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace CompleteUserRegisterDTO {
  export type Request = {
    code: string;
    name: string;
    login: string;
    password: string;
    confirmPassword: string;
  };
}
