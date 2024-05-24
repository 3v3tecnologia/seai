import { CommandController } from "../../../../shared/presentation/command-controller";
import { HttpResponse, created, forbidden, serverError } from "../../../../shared/presentation/http-responses";
import { RegisterUserLogs } from "../../../system-logs/services";
import { ResetPassword } from "../../use-cases";


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
        {
          code: request.code,
          password: request.password,
          confirmPassword: request.confirmPassword
        }
      );

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
