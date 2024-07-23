import { ISchemaValidator } from "../../../shared/validation/validator";
import {
  badRequest,
  serverError,
  ok,
} from "../../../presentation/controllers/helpers";
import { ConfirmSubscriberByCodeUseCaseProtocol } from "../services/confirm-subscriber-by-code.service";
import { HttpResponse } from "../../../presentation/controllers/ports";

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

      return ok(createdOrError.value);
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
