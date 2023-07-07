import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { SignUp } from "../../../domain/use-cases/user/sign-up";
import { badRequest, forbidden, ok, serverError } from "../helpers";
import { Validator } from "../../../shared/validation/ports/validator";
import { RegisterUserLogs } from "../../../domain/use-cases/logs/register-user-logs";

// Controllers são classes puras e não devem depender de frameworks
export class SignUpController implements Controller<any> {
  private signUp: SignUp;
  private validator: Validator;
  private userLogs: RegisterUserLogs;

  constructor(
    signUp: SignUp,
    validator: Validator,
    userLogs: RegisterUserLogs
  ) {
    this.signUp = signUp;
    this.validator = validator;
    this.userLogs = userLogs;
  }

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      console.log("request = > ", request);
      const error = this.validator.validate(request);

      if (error.isLeft()) {
        return badRequest(error.value);
      }

      const result = await this.signUp.create(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      await this.userLogs.log(request.accountId, this.signUp.useCaseLogs());
      //Add validation here
      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace SignUpController {
  export type Request = {
    accountId: number;
    email: string;
    name: string;
    login: string;
    password: string;
    confirmPassword: string;
  };
}
