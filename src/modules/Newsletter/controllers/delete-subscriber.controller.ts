import {
  badRequest,
  created,
  forbidden,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";

import { ISchemaValidator } from "../../../shared/validation/validator";
import { DeleteNewsletterSubscriber } from "../services";

export class DeleteNewsletterSubscriberController {
  private useCase: DeleteNewsletterSubscriber;
  private validator: ISchemaValidator;

  constructor(
    useCase: DeleteNewsletterSubscriber,
    validator: ISchemaValidator
  ) {
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(
    request: DeleteNewsletterSubscriberControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const { email } = request;

      const { error } = await this.validator.validate(email);

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await this.useCase.execute({
        Email: request.email,
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

export namespace DeleteNewsletterSubscriberControllerProtocol {
  export type Request = {
    accountId: number;
    email: string;
  };
}
