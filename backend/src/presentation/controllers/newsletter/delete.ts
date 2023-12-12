import { HttpResponse } from "../ports";

import { DeleteNews } from "../../../domain/use-cases/newsletter/delete";
import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class DeleteNewsController extends CommandController<
  DeleteNewsController.Request,
  HttpResponse
> {
  private useCase: DeleteNews;

  constructor(useCase: DeleteNews, userLogs: RegisterUserLogs) {
    super(userLogs);
    this.useCase = useCase;
  }

  async handle(request: DeleteNewsController.Request): Promise<HttpResponse> {
    try {
      const createdOrError = await this.useCase.create({
        Id: request.id,
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

export namespace DeleteNewsController {
  export type Request = {
    accountId: number;
    id: number;
  };
}
