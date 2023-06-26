import { CreateUser } from "../../../domain/use-cases/user/create-user/create-user";
import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok, serverError } from "../helpers";
import { SignIn } from "../../../domain/use-cases/user/sign-in";

// Controllers são classes puras e não devem depender de frameworks
export class SignInController implements Controller<any> {
  private signIn: SignIn;

  constructor(signIn: SignIn) {
    this.signIn = signIn;
  }

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    try {
      console.log("request = > ", request);
    await this.signIn.execute(request);
    //Add validation here
    return ok({ message: "login" });
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace CreateUserController {
  export type Request = {
    login: string;
    password: string;
  };
}
