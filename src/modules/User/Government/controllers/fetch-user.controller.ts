import {
  IPaginationInput,
  parsePaginationInput,
} from "../../../../domain/use-cases/helpers/pagination";
import {
  badRequest,
  ok,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { ISchemaValidator } from "../../../../shared/validation/validator";
import { UserTypes } from "../../core/model/user";
import { IFetchUsersUseCase } from "../services";

export class FetchUserController
  implements Controller<FetchUserControllerProtocol.Request, HttpResponse>
{
  private fetchUser: IFetchUsersUseCase;
  private validator: ISchemaValidator;

  constructor(fetchUser: IFetchUsersUseCase, validator: ISchemaValidator) {
    this.fetchUser = fetchUser;
    this.validator = validator;
  }

  async handle(
    request: FetchUserControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const { accountId, id, limit, name, offset, pageNumber, type } = request;

      const { error } = await this.validator.validate({
        accountId,
        id,
        limit,
        name,
        offset,
        pageNumber,
        type,
      });

      if (error) {
        return badRequest(error);
      }

      if (id || accountId) {
        const result = await this.fetchUser.execute({
          id: id || accountId,
        });

        return ok(result.value);
      }

      const result = await this.fetchUser.execute({
        name,
        type,
        ...parsePaginationInput({
          page: pageNumber,
          limit: limit,
        }),
      });

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
