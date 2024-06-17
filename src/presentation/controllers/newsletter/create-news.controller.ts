import { HttpResponse } from "../ports";

import { CreateNews } from "../../../domain/use-cases/newsletter/create";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

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
        SendDate: request.SendDate
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
    SendDate: string;
    LocationName?: string;
  };
}
