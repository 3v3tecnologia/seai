import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { LoaUserModules } from "../../../domain/use-cases/user/load_user_access/load_user_access";
import { forbidden, ok, serverError } from "../helpers";

export class LoadUserAccessController
  implements Controller<LoadUserAccessController.Request, HttpResponse>
{
  private loadUser: LoaUserModules;

  constructor(loadUser: LoaUserModules) {
    this.loadUser = loadUser;
  }

  async handle(
    request: LoadUserAccessController.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.loadUser.execute(request.id);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
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
