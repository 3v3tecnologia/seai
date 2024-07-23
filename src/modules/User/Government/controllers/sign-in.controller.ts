import { HttpResponse } from "../../../../presentation/controllers/ports";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { SignIn } from "../services";
import {
  badRequest,
  ok,
  serverError,
  forbidden,
} from "../../../../presentation/controllers/helpers";

export class SignInController
  implements Controller<SignInControllerProtocol.Request, HttpResponse>
{
  private signIn: SignIn;

  constructor(signIn: SignIn) {
    this.signIn = signIn;
  }

  async handle(
    request: SignInControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      // if (!request.login ) {
      //   return badRequest(new Error("É necessário informar o login"));
      // }
      if (!request.password) {
        return badRequest(new Error("É necessário informar a senha"));
      }
      if (typeof request.password !== "string") {
        return badRequest(new Error("Senha deve ser do formato textual"));
      }

      const result = await this.signIn.execute(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace SignInControllerProtocol {
  export type Request = {
    email?: string;
    login?: string;
    password: string;
  };
}
