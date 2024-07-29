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

export class FetchAllUsersController
  implements Controller<FetchAllUsersControllerProtocol.Request, HttpResponse>
{
  private fetchUser: IFetchUsersUseCase;
  private validator: ISchemaValidator;

  constructor(fetchUser: IFetchUsersUseCase, validator: ISchemaValidator) {
    this.fetchUser = fetchUser;
    this.validator = validator;
  }

  async handle(
    request: FetchAllUsersControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const { limit, name, offset, pageNumber, type } = request;

      const { error } = await this.validator.validate({
        limit,
        name,
        offset,
        pageNumber,
        type,
      });

      if (error) {
        return badRequest(error);
      }

      const result = await this.fetchUser.execute({
        name: name,
        type: type,
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

export namespace FetchAllUsersControllerProtocol {
  export type Request = {
    name?: string;
    type?: Record<UserTypes, string>;
  } & Partial<IPaginationInput>;
}
