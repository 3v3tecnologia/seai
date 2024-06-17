import { HttpResponse } from "../ports";

import { CreateNews } from "../../../domain/use-cases/newsletter/create";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { badRequest, created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";
import { ISchemaValidator } from "../../../shared/validation/validator";

export class CreateNewsController extends CommandController<
  CreateNewsController.Request,
  HttpResponse
> {
  private useCase: CreateNews;
  private validator: ISchemaValidator;

  constructor(useCase: CreateNews, userLogs: RegisterUserLogs, validator: ISchemaValidator) {
    super(userLogs);
    this.useCase = useCase;
    this.validator = validator
  }

  async handle(request: CreateNewsController.Request): Promise<HttpResponse> {
    try {
      const { Data, Description, FK_Author, SendDate, Title, LocationName } = request

      const { error } = await this.validator.validate({
        Data, Description, FK_Author, SendDate, Title, LocationName
      })

      if (error) {
        return badRequest(error)
      }


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
