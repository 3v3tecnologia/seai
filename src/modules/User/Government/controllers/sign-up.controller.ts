import {
  forbidden,
  ok,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { SignUp } from "../services";

export class SignUpController {
  private signUp: SignUp;

  constructor(signUp: SignUp) {
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
