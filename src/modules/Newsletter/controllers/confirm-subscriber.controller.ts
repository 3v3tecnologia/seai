import {
  badRequest,
  noContent,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { ISchemaValidator } from "../../../shared/validation/validator";
import { ConfirmSubscriberByCodeUseCaseProtocol } from "../services/confirm-user-subscription.service";

export class ConfirmSubscriberByCodeController {
  private useCase: ConfirmSubscriberByCodeUseCaseProtocol.UseCase;
  private validator: ISchemaValidator;

  constructor(
    useCase: ConfirmSubscriberByCodeUseCaseProtocol.UseCase,
    validator: ISchemaValidator
  ) {
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(
    request: ConfirmSubscriberByCodeController.Request
  ): Promise<HttpResponse> {
    try {
      const { code } = request;

      const createdOrError = await this.useCase.execute({
        Code: code,
      });

      if (createdOrError.isLeft()) {
        return badRequest(createdOrError.value);
      }

      return noContent();
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace ConfirmSubscriberByCodeController {
  export type Request = {
    code: string;
  };
}
