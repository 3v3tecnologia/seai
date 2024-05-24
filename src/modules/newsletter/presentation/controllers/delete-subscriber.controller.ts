import { HttpResponse } from "../../../../shared/presentation/ports";

import { DeleteNewsletterSubscriber } from "../../services";
import { RegisterUserLogs } from "../../../system-logs/services/register-user-logs";
import { created, forbidden, serverError } from "../../../../presentation/controllers/helpers";
import { CommandController } from "../../../../shared/presentation/command-controller";

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
