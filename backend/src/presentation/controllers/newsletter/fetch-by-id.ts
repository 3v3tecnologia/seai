import { HttpResponse } from "../ports";

import { FetchNewsByIdUseCaseProtocol } from "../../../domain/use-cases/newsletter/fetch-by-id";
import { forbidden, ok, serverError } from "../helpers";

export class FetchNewsByIdController {
  private useCase: FetchNewsByIdUseCaseProtocol.UseCase;

  constructor(useCase: FetchNewsByIdUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: FetchNewsByIdController.Request
  ): Promise<HttpResponse> {
    try {
      const createdOrError = await this.useCase.create({
        Id: request.Id,
      });

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return ok(createdOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchNewsByIdController {
  export type Request = {
    accountId: number;
    Id: number;
  };
}
