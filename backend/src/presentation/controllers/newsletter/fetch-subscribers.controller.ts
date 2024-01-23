import { HttpResponse } from "../ports";

import { FetchSubscribersUseCaseProtocol } from "../../../domain/use-cases/newsletter";
import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class FetchNewsletterSubscribersController extends CommandController<
  FetchNewsletterSubscribersControllerProtocol.Request,
  HttpResponse
> {
  private useCase: FetchSubscribersUseCaseProtocol.UseCase;

  constructor(
    useCase: FetchSubscribersUseCaseProtocol.UseCase,
    userLogs: RegisterUserLogs
  ) {
    super(userLogs);
    this.useCase = useCase;
  }

  async handle(
    request: FetchNewsletterSubscribersControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const createdOrError = await this.useCase.execute({
        email: request.email,
        limit: request.limit,
        pageNumber: request.pageNumber,
      });

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return created(createdOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchNewsletterSubscribersControllerProtocol {
  export type Request = { email?: string } & Omit<
    FetchSubscribersUseCaseProtocol.Request,
    "Id"
  >;
}
