import { HttpResponse } from "../../../../shared/presentation/ports";

import { CreateNews } from "../../services/create";
import { RegisterUserLogs } from "../../../logs/services/register-user-logs";
import { created, forbidden, serverError } from "../../../../presentation/controllers/helpers";
import { CommandController } from "../../../../shared/presentation/command-controller";

export class CreateNewsController extends CommandController<
  CreateNewsController.Request,
  HttpResponse
> {
  private useCase: CreateNews;

  constructor(useCase: CreateNews, userLogs: RegisterUserLogs) {
    super(userLogs);
    this.useCase = useCase;
  }

  async handle(request: CreateNewsController.Request): Promise<HttpResponse> {
    try {
      const createdOrError = await this.useCase.create({
        Data: request.Data,
        Description: request.Description,
        FK_Author: request.FK_Author,
        Title: request.Title,
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

export namespace CreateNewsController {
  export type Request = {
    accountId: number;
    FK_Author: number;
    Title: string;
    Description: string | null;
    Data: any;
    SendDate?: string;
    LocationName?: string;
  };
}
