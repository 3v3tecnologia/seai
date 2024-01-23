import { HttpResponse } from "../ports";

import { SubscribeToNews } from "../../../domain/use-cases/newsletter";
import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class SubscribeToNewsController extends CommandController<
  SubscribeToNewsControllerProtocol.Request,
  HttpResponse
> {
  private useCase: SubscribeToNews;

  constructor(useCase: SubscribeToNews, userLogs: RegisterUserLogs) {
    super(userLogs);
    this.useCase = useCase;
  }

  async handle(
    request: SubscribeToNewsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const createdOrError = await this.useCase.execute({
        Email: request.email,
        Name: request.name,
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

export namespace SubscribeToNewsControllerProtocol {
  export type Request = {
    accountId: number;
    email: string;
    name: string;
  };
}
