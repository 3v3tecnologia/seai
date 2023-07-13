import { ForgotPassword } from "../../../domain/use-cases/user/send-forgot-password/forgot-password";
import { created, forbidden, serverError } from "../helpers";
import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

export class ForgotPasswordController
  implements Controller<ForgotPasswordController.Request, HttpResponse>
{
  private forgotPassword: ForgotPassword;

  constructor(forgotPassword: ForgotPassword) {
    this.forgotPassword = forgotPassword;
  }

  async handle(
    request: ForgotPasswordController.Request
  ): Promise<HttpResponse> {
    try {
      const { email } = request;

      const createdOrError = await this.forgotPassword.execute(email);

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

export namespace ForgotPasswordController {
  export type Request = {
    email: string;
  };
}
