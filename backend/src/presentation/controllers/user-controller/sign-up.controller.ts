import { HttpResponse } from "../ports";

import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { SignUp } from "../../../domain/use-cases/user/sign-up";
import { forbidden, ok, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class SignUpController extends CommandController<
  SignUpController.Request,
  HttpResponse
> {
  private signUp: SignUp;

  constructor(signUp: SignUp, userLogs: RegisterUserLogs) {
    super(userLogs);
    this.signUp = signUp;
  }

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const result = await this.signUp.create(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      // await this.userLogs.log(request.accountId, this.signUp.useCaseLogs());
      return ok(result.value);
    } catch (error) {
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
