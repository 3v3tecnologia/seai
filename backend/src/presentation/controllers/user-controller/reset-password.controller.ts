import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { ResetPassword } from "../../../domain/use-cases/user/reset-password/reset-password";
import { Validator } from "../../../shared/validation/ports/validator";
import { badRequest, created, forbidden, serverError } from "../helpers";
import { HttpResponse } from "../ports";
import { CommandController } from "../ports/command-controller";

export class ResetPasswordController extends CommandController<
  ResetPasswordController.Request,
  HttpResponse
> {
  private resetPassword: ResetPassword;
  private validator: Validator;

  constructor(
    resetPassword: ResetPassword,
    validator: Validator,
    userLogs: RegisterUserLogs
  ) {
    super(userLogs);
    this.resetPassword = resetPassword;
    this.validator = validator;
  }

  async handle(
    request: ResetPasswordController.Request
  ): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request);

      if (error.isLeft()) {
        return badRequest(error.value);
      }

      const createdOrError = await this.resetPassword.execute(
        request.token,
        request.password
      );

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }
      await this.userLogs.log(
        request.accountId,
        this.resetPassword.useCaseLogs()
      );
      //Add validation here
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
    token: string;
  };
}
