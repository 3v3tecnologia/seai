import { CommandController } from "../../../../shared/presentation/command-controller";
import { HttpResponse, forbidden, ok, serverError } from "../../../../shared/presentation/http-responses";
import { RegisterUserLogs } from "../../../system-logs/services";
import { SignUp } from "../../use-cases";

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
