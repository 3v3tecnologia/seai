import { HttpResponse } from "../ports";

import { DeleteNews } from "../../../domain/use-cases/newsletter/delete";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { badRequest, created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";
import { ISchemaValidator } from "../../../shared/validation/validator";

export class DeleteNewsController extends CommandController<
  DeleteNewsController.Request,
  HttpResponse
> {
  private useCase: DeleteNews;
  private validator: ISchemaValidator;

  constructor(useCase: DeleteNews, userLogs: RegisterUserLogs, validator: ISchemaValidator) {
    super(userLogs);
    this.useCase = useCase;
    this.validator = validator
  }

  async handle(request: DeleteNewsController.Request): Promise<HttpResponse> {
    try {
      const { id } = request

      const { error } = await this.validator.validate({
        id,
      })

      if (error) {
        return badRequest(error)
      }

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
