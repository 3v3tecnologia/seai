import { HttpResponse } from "../../../../shared/presentation/ports";

import { DeleteNews } from "../../services/delete";
import { RegisterUserLogs } from "../../../system-logs/services/register-user-logs";
import { created, forbidden, serverError } from "../../../../presentation/controllers/helpers";
import { CommandController } from "../../../../shared/presentation/command-controller";

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
