import {
  IPaginationInput,
  parsePaginationInput,
} from "../../../../domain/use-cases/helpers/pagination";
import { ok, serverError } from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { UserTypes } from "../model/user";
import { IFetchUsersUseCase } from "../services";

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
      if (request.id || request.accountId) {
        const result = await this.fetchUser.execute({
          id: request.id || request.accountId,
        });

        return ok(result.value);
      }

      const dto = {
        name: request.name,
        type: request.type,
        ...parsePaginationInput({
          page: request.pageNumber,
          limit: request.limit,
        }),
      };

      const result = await this.fetchUser.execute(dto);

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchUserControllerProtocol {
  export type Request = {
    id?: number;
    accountId?: number;
    name?: string;
    type?: Record<UserTypes, string>;
  } & Partial<IPaginationInput>;
}
