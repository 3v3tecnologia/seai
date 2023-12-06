import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { ResetPassword } from "../../../domain/use-cases/user/reset-password/reset-password";
import { created, forbidden, serverError } from "../helpers";
import { HttpResponse } from "../ports";
import { CommandController } from "../ports/command-controller";

export class ResetPasswordController extends CommandController<
  ResetPasswordController.Request,
  HttpResponse
> {
  private resetPassword: ResetPassword;

  constructor(resetPassword: ResetPassword, userLogs: RegisterUserLogs) {
    super(userLogs);
    this.resetPassword = resetPassword;
  }

  async handle(
    request: ResetPasswordController.Request
  ): Promise<HttpResponse> {
    try {
      const createdOrError = await this.resetPassword.execute(
        request.accessToken,
        request.password,
        request.confirmPassword
      );

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }
      await this.userLogs.log(request.accountId, this.resetPassword);

      return created("Senha resetada com sucesso");
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace ResetPasswordController {
  export type Request = {
    accountId: number;
    password: string;
    confirmPassword: string;
    accessToken: string;
  };
}
