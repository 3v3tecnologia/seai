import { HttpResponse } from "../../../../shared/presentation/ports";

import { SubscribeToNews } from "../../services";
import { RegisterUserLogs } from "../../../system-logs/services/register-user-logs";
import { created, forbidden, serverError } from "../../../../presentation/controllers/helpers";
import { CommandController } from "../../../../shared/presentation/command-controller";

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
        Email: request.Email,
        Name: request.Name,
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
    Email: string;
    Name: string;
  };
}
