import { HttpResponse } from "../ports";

import { FetchSubscribersUseCaseProtocol } from "../../../domain/use-cases/newsletter";
import { created, forbidden, serverError } from "../helpers";

export class FetchNewsletterSubscribersController  {
  private useCase: FetchSubscribersUseCaseProtocol.UseCase;

  constructor(
    useCase: FetchSubscribersUseCaseProtocol.UseCase,
  ) {
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

      console.log("[FetchNewsletterSubscribersController] ",{
        email: request.email,
        limit: request.limit,
        pageNumber: request.pageNumber,
      })

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
