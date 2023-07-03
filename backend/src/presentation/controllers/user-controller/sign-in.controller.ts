import { CreateUser } from "../../../domain/use-cases/user/create-user/create-user";
import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { badRequest, forbidden, ok, serverError } from "../helpers";
import { SignIn } from "../../../domain/use-cases/user/sign-in";

// Controllers são classes puras e não devem depender de frameworks
export class SignInController implements Controller<any> {
  private signIn: SignIn;

  constructor(signIn: SignIn) {
    this.signIn = signIn;
  }

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    try {
      if(!request.login){
        return badRequest(new Error("É necessário informar o login")) 
      }
      if(!request.password){
        return badRequest(new Error("É necessário informar a senha")) 
      }
      if(typeof request.password !== "string"){
        return badRequest(new Error("Senha deve ser do formato textual")) 
      }
      const result = await this.signIn.execute(request);


      if (result.isLeft()) {
        return forbidden(result.value);
      }
      //Add validation here
      return ok({ message: result.value });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace CreateUserController {
  export type Request = {
    login: string;
    password: string;
  };
}
