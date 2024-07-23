import {
  badRequest,
  created,
  forbidden,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";

import { ISchemaValidator } from "../../../shared/validation/validator";
import { SubscribeToNews } from "../services";

export class SubscribeToNewsController {
  private useCase: SubscribeToNews;
  private validator: ISchemaValidator;

  constructor(useCase: SubscribeToNews, validator: ISchemaValidator) {
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(
    request: SubscribeToNewsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const { Email, Name } = request;

      const { error } = await this.validator.validate({
        Email,
        Name,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await this.useCase.execute({
        Email: request.Email,
        Name: request.Name,
      });

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return created(createdOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace SubscribeToNewsControllerProtocol {
  export type Request = {
    accountId: number;
    Email: string;
    Name: string;
  };
}
