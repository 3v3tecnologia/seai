import { HttpResponse } from "../ports";

import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { SignUp } from "../../../domain/use-cases/user/sign-up";
import { Validator } from "../../../shared/validation/ports/validator";
import { badRequest, forbidden, ok, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

// Controllers são classes puras e não devem depender de frameworks
export class SignUpController extends CommandController<
  SignUpController.Request,
  HttpResponse
> {
  private signUp: SignUp;
  private validator: Validator;

  constructor(
    signUp: SignUp,
    validator: Validator,
    userLogs: RegisterUserLogs
  ) {
    super(userLogs);
    this.signUp = signUp;
    this.validator = validator;
  }

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
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
