import {
  badRequest,
  created,
  forbidden,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";

import { ISchemaValidator } from "../../../shared/validation/validator";
import { DeleteNews } from "../services";

export class DeleteNewsController {
  private useCase: DeleteNews;
  private validator: ISchemaValidator;

  constructor(useCase: DeleteNews, validator: ISchemaValidator) {
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(request: DeleteNewsController.Request): Promise<HttpResponse> {
    try {
      const { id } = request;

      const { error } = await this.validator.validate({
        id,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await this.useCase.create({
        Id: request.id,
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

export namespace DeleteNewsController {
  export type Request = {
    accountId: number;
    id: number;
  };
}
