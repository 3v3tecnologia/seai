import {
  created,
  forbidden,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { ResetPassword } from "../services";

export class ResetPasswordController {
  private resetPassword: ResetPassword;

  constructor(resetPassword: ResetPassword) {
    this.resetPassword = resetPassword;
  }

  async handle(
    request: ResetPasswordController.Request
  ): Promise<HttpResponse> {
    try {
      const createdOrError = await this.resetPassword.execute({
        code: request.code,
        password: request.password,
        confirmPassword: request.confirmPassword,
      });

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }
      // await this.userLogs.log(request.accountId, this.resetPassword);

      return created("Senha resetada com sucesso");
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace ResetPasswordController {
  export type Request = {
    code: string;
    password: string;
    confirmPassword: string;
  };
}
