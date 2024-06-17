import { HttpResponse } from "../ports";

import { FetchNewsByIdUseCaseProtocol } from "../../../domain/use-cases/newsletter/fetch-by-id";
import { badRequest, forbidden, ok, serverError } from "../helpers";
import { ISchemaValidator } from "../../../shared/validation/validator";

export class FetchNewsByIdController {
  private useCase: FetchNewsByIdUseCaseProtocol.UseCase;
  private validator: ISchemaValidator;

  constructor(useCase: FetchNewsByIdUseCaseProtocol.UseCase, validator: ISchemaValidator) {
    this.useCase = useCase;
    this.validator = validator
  }

  async handle(
    request: FetchNewsByIdController.Request
  ): Promise<HttpResponse> {
    try {
      const { id } = request

      const { error } = await this.validator.validate({
        id,
      })

      if (error) {
        return badRequest(error)
      }

      const createdOrError = await this.useCase.execute({
        Id: request.id,
      });

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return ok(createdOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchNewsByIdController {
  export type Request = {
    accountId: number;
    id: number;
  };
}
