import { HttpResponse } from "../../../../presentation/controllers/ports";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { SignIn } from "../services";
import {
  badRequest,
  ok,
  serverError,
  forbidden,
} from "../../../../presentation/controllers/helpers";
import { ISchemaValidator } from "../../../../shared/validation/validator";

export class SignInController
  implements Controller<SignInControllerProtocol.Request, HttpResponse>
{
  private signIn: SignIn;
  private validator: ISchemaValidator;

  constructor(signIn: SignIn, validator: ISchemaValidator) {
    this.signIn = signIn;
    this.validator = validator;
  }

  async handle(
    request: SignInControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const { password, email, login } = request;

      const { error } = await this.validator.validate({
        password,
        email,
        login,
      });

      if (error) {
        return badRequest(error);
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
