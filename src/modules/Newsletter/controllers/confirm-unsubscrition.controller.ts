import { HttpResponse } from "../../../presentation/controllers/ports";

import { ISchemaValidator } from "../../../shared/validation/validator";
import {
  badRequest,
  serverError,
  ok,
} from "../../../presentation/controllers/helpers";
import { ConfirmUnsubscribeByCodeUseCaseProtocol } from "../services/confirm-unsubscribe-by-code.service";
import { ConfirmSubscriberByCodeUseCaseProtocol } from "../services/confirm-subscriber-by-code.service";

export class ConfirmUnsubscribeByCodeController {
  private useCase: ConfirmUnsubscribeByCodeUseCaseProtocol.UseCase;
  private validator: ISchemaValidator;

  constructor(
    useCase: ConfirmSubscriberByCodeUseCaseProtocol.UseCase,
    validator: ISchemaValidator
  ) {
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(
    request: ConfirmUnsubscribeController.Request
  ): Promise<HttpResponse> {
    try {
      const { code } = request;

      const createdOrError = await this.useCase.execute({
        Code: code,
      });

      if (createdOrError.isLeft()) {
        return badRequest(createdOrError.value);
      }

      return ok(createdOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace ConfirmUnsubscribeController {
  export type Request = {
    code: string;
  };
}
