import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import {
  FetchUsersDTO,
  IFetchUsersUseCase,
} from "../../../domain/use-cases/user/fetch-users";
import { ok, serverError } from "../helpers";

export class FetchUserController
  implements Controller<FetchUserControllerProtocol.Request, HttpResponse>
{
  private fetchUser: IFetchUsersUseCase;

  constructor(fetchUser: IFetchUsersUseCase) {
    this.fetchUser = fetchUser;
  }

  async handle(
    request: FetchUserControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.fetchUser.execute(request);

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchUserControllerProtocol {
  export type Request = FetchUsersDTO.Request;
}
