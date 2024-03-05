import { HttpResponse } from "../ports";

import { DeleteNewsletterSubscriber } from "../../../domain/use-cases/newsletter";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class DeleteNewsletterSubscriberController extends CommandController<
  DeleteNewsletterSubscriberControllerProtocol.Request,
  HttpResponse
> {
  private useCase: DeleteNewsletterSubscriber;

  constructor(useCase: DeleteNewsletterSubscriber, userLogs: RegisterUserLogs) {
    super(userLogs);
    this.useCase = useCase;
  }

  async handle(
    request: DeleteNewsletterSubscriberControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
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
