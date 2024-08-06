import { ISchemaValidator } from "../../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../../shared/ports/http-response";
import {
  created,
  forbidden,
  serverError,
} from "../../../../shared/utils/http-responses";
import { ResetPassword } from "../services";

export class ResetPasswordController {
  private resetPassword: ResetPassword;
  private validator: ISchemaValidator;

  constructor(resetPassword: ResetPassword, validator: ISchemaValidator) {
    this.resetPassword = resetPassword;
    this.validator = validator;
  }

  async handle(
    request: ResetPasswordController.Request
  ): Promise<HttpResponse> {
    try {
      const { code, confirmPassword, password } = request;

      // const { error } = await this.validator.validate({
      //   code,
      //   confirmPassword,
      //   password,
      // });

      // if (error) {
      //   return badRequest(error);
      // }

      const createdOrError = await this.resetPassword.execute({
        code,
        password,
        confirmPassword,
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
