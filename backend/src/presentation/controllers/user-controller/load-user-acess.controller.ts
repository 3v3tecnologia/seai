import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { LoaUserModules } from "../../../domain/use-cases/user/load_user_access/load_user_access";
import { Validator } from "../../../shared/validation/ports/validator";
import { badRequest, ok, forbidden, serverError } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class LoadUserAccessController
  implements Controller<LoadUserAccessController.Request, HttpResponse>
{
  private loadUser: LoaUserModules;
  private validator: Validator;

  constructor(loadUser: LoaUserModules, validator: Validator) {
    this.loadUser = loadUser;
    this.validator = validator;
  }

  async handle(
    request: LoadUserAccessController.Request
  ): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request);

      if (error.isLeft()) {
        return badRequest(error.value);
      }
      const result = await this.loadUser.execute(request.id);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      //Add validation here
      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace LoadUserAccessController {
  export type Request = {
    id: number;
  };
}
