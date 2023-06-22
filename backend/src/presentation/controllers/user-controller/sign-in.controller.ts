import { CreateUser } from "../../../domain/use-cases/user/create-user/create-user";
import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { ok } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class SignInController implements Controller<any> {
  private signIn: SignIn;

  constructor(signIn: SignIn) {
    this.signIn = signIn;
  }

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    console.log("request = > ", request);
    await this.signIn.execute();
    //Add validation here
    return ok({ message: "kkk" });
  }
}

export namespace CreateUserController {
  export type Request = {
    name: string;
    sex: string;
  };
}
