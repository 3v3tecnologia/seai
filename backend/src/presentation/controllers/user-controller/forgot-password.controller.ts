import { ForgotPassword } from "../../../domain/use-cases/user/send-forgot-password/forgot-password";
import { Validator } from "../../../shared/validation/ports/validator";
import { badRequest, created, forbidden, serverError } from "../helpers";
import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

export class ForgotPasswordController
  implements Controller<ForgotPasswordController.Request, HttpResponse>
{
  private forgotPassword: ForgotPassword;
  private validator: Validator;

  constructor(forgotPassword: ForgotPassword, validator: Validator) {
    this.forgotPassword = forgotPassword;
    this.validator = validator;
  }

  async handle(
    request: ForgotPasswordController.Request
  ): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request);

      if (error.isLeft()) {
        return badRequest(error.value);
      }

      const { email } = request;

      const createdOrError = await this.forgotPassword.execute(email);

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }
      //Add validation here
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
