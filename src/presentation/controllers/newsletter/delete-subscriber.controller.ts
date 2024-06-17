import { HttpResponse } from "../ports";

import { DeleteNewsletterSubscriber } from "../../../domain/use-cases/newsletter";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { badRequest, created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";
import { ISchemaValidator } from "../../../shared/validation/validator";

export class DeleteNewsletterSubscriberController extends CommandController<
  DeleteNewsletterSubscriberControllerProtocol.Request,
  HttpResponse
> {
  private useCase: DeleteNewsletterSubscriber;
  private validator: ISchemaValidator;

  constructor(useCase: DeleteNewsletterSubscriber, userLogs: RegisterUserLogs, validator: ISchemaValidator) {
    super(userLogs);
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(
    request: DeleteNewsletterSubscriberControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const { email } = request

      const { error } = await this.validator.validate(email)

      if (error) {
        return badRequest(error)
      }

      const createdOrError = await this.useCase.execute({
        Email: request.email,
      });

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      await this.userLogs.log(request.accountId, this.useCase);

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
