import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";

import { ISchemaValidator } from "../../../shared/validation/validator";
import { UpdateNewsletterSendAtUseCaseProtocol } from "../services";

export class UpdateSendAtController {
  private useCase: UpdateNewsletterSendAtUseCaseProtocol.UseCase;
  private validator: ISchemaValidator;

  constructor(
    useCase: UpdateNewsletterSendAtUseCaseProtocol.UseCase,
    validator: ISchemaValidator
  ) {
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(request: UpdateSendAtController.Request): Promise<HttpResponse> {
    try {
      const { id } = request;

      const { error } = await this.validator.validate({
        id,
      });

      if (error) {
        return badRequest(error);
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

export namespace UpdateSendAtController {
  export type Request = {
    accountId: number;
    id: number;
  };
}
