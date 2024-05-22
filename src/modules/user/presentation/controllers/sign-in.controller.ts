import { Controller } from "../../../../shared/presentation/controllers";
import { HttpResponse, badRequest, forbidden, ok, serverError } from "../../../../shared/presentation/http-responses";
import { SignIn } from "../../use-cases";

export class SignInController
  implements Controller<SignInControllerProtocol.Request, HttpResponse> {
  private signIn: SignIn;

  constructor(signIn: SignIn) {
    this.signIn = signIn;
  }

  async handle(
    request: SignInControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      if (!request.login) {
        return badRequest(new Error("É necessário informar o login"));
      }
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
    login: string;
    password: string;
  };
}
