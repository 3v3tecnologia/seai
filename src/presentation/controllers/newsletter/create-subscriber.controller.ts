import { HttpResponse } from "../ports";

import { SubscribeToNews } from "../../../domain/use-cases/newsletter";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { badRequest, created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";
import { ISchemaValidator } from "../../../shared/validation/validator";

export class SubscribeToNewsController extends CommandController<
  SubscribeToNewsControllerProtocol.Request,
  HttpResponse
> {
  private useCase: SubscribeToNews;
  private validator: ISchemaValidator;

  constructor(useCase: SubscribeToNews, userLogs: RegisterUserLogs, validator: ISchemaValidator) {
    super(userLogs);
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(
    request: SubscribeToNewsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const { Email, Name } = request

      const { error } = await this.validator.validate({
        Email, Name
      })

      if (error) {
        return badRequest(error)
      }

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
