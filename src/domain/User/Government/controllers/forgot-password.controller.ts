import { ISchemaValidator } from "../../../../shared/infra/validator/validator";
import { Controller } from "../../../../shared/ports/controllers";
import { HttpResponse } from "../../../../shared/ports/http-response";
import {
  created,
  forbidden,
  serverError,
} from "../../../../shared/utils/http-responses";
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
