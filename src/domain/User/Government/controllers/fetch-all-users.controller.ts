import {
  IPaginationInput,
  parsePaginationInput,
} from "../../../../shared/utils/pagination";

import { ISchemaValidator } from "../../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../../shared/ports/http-response";
import { ok, serverError } from "../../../../shared/utils/http-responses";

import { Controller } from "../../../../shared/ports/controllers";
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

      // const { error } = await this.validator.validate({
      //   limit,
      //   name,
      //   offset,
      //   pageNumber,
      //   type,
      // });

      // if (error) {
      //   return badRequest(error);
      // }

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
