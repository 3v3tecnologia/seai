import { ISchemaValidator } from "../../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../../shared/ports/http-response";
import {
  forbidden,
  ok,
  serverError,
} from "../../../../shared/utils/http-responses";
import { SignUp } from "../services";

export class SignUpController {
  private signUp: SignUp;
  private validator: ISchemaValidator;

  constructor(signUp: SignUp, validator: ISchemaValidator) {
    this.signUp = signUp;
    this.validator = validator;
  }

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const { password, accountId, confirmPassword, login, name } = request;

      // const { error } = await this.validator.validate({
      //   password,
      //   accountId,
      //   confirmPassword,
      //   login,
      //   name,
      // });

      // if (error) {
      //   return badRequest(error);
      // }

      const result = await this.signUp.create(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      // await this.userLogs.log(request.accountId, this.signUp.useCaseLogs());
      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace SignUpController {
  export type Request = {
    accountId: number;
    name: string;
    login: string;
    password: string;
    confirmPassword: string;
  };
}
