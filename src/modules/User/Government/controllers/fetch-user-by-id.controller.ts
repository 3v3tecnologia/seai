import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { ISchemaValidator } from "../../../../shared/validation/validator";
import { FetchUserById } from "../services";

export class FetchUserByIdController
  implements Controller<FetchUserByIdControllerProtocol.Request, HttpResponse>
{
  private loadUser: FetchUserById;
  private validator: ISchemaValidator;

  constructor(loadUser: FetchUserById, validator: ISchemaValidator) {
    this.loadUser = loadUser;
    this.validator = validator;
  }

  async handle(
    request: FetchUserByIdControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const { accountId, id } = request;

      // const { error } = await this.validator.validate({
      //   accountId,
      //   id,
      // });

      // if (error) {
      //   return badRequest(error);
      // }

      const result = await this.loadUser.execute({
        userId: request.id || request.accountId,
      });

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

export namespace FetchUserByIdControllerProtocol {
  export type Request = {
    accountId: number;
    id: number;
  };
}
