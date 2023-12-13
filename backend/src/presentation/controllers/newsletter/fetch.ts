import { HttpResponse } from "../ports";

import { FetchAllNews } from "../../../domain/use-cases/newsletter/fetch";
import { forbidden, ok, serverError } from "../helpers";

export class FetchNewsController {
  private useCase: FetchAllNews.UseCase;

  constructor(useCase: FetchAllNews.UseCase) {
    this.useCase = useCase;
  }

  async handle(request: FetchNewsController.Request): Promise<HttpResponse> {
    try {
      const createdOrError = await this.useCase.create({
        limit: request.Id,
        pageNumber: request.accountId,
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

export namespace FetchNewsController {
  export type Request = {
    accountId: number;
    Id: number;
  };
}
