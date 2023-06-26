import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { SignUp } from "../../../domain/use-cases/user/sign-up";
import { ok, serverError } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class SignUpController implements Controller<any> {
  private signUp: SignUp;

  constructor(signUp: SignUp) {
    this.signUp = signUp;
  }

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      console.log("request = > ", request);
    await this.signUp.create(request);
    //Add validation here
    return ok({ message: "login" });
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    email: string;
    name: string;
    login: string;
    password: string;
    confirmPassword: string;
  };
}
