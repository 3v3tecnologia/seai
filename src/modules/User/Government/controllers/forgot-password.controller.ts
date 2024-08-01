import {
  badRequest,
  created,
  forbidden,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { ISchemaValidator } from "../../../../shared/validation/validator";
import { ForgotPassword } from "../services";

export class ForgotPasswordController
  implements Controller<ForgotPasswordController.Request, HttpResponse>
{
  private forgotPassword: ForgotPassword;
  private validator: ISchemaValidator;

  constructor(forgotPassword: ForgotPassword, validator: ISchemaValidator) {
    this.forgotPassword = forgotPassword;
    this.validator = validator;
  }

  async handle(
    request: ForgotPasswordController.Request
  ): Promise<HttpResponse> {
    try {
      const { email } = request;

      // const { error } = await this.validator.validate({
      //   email,
      // });

      // if (error) {
      //   return badRequest(error);
      // }

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
