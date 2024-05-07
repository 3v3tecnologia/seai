import { HttpResponse } from "../ports";

import { IPaginationInput, parsePaginationInput } from "../../../domain/use-cases/helpers/pagination";
import { FetchAllNews } from "../../../domain/use-cases/newsletter/fetch";
import { forbidden, ok, serverError } from "../helpers";

export class FetchNewsController {
  private useCase: FetchAllNews.UseCase;

  constructor(useCase: FetchAllNews.UseCase) {
    this.useCase = useCase;
  }

  async handle(request: FetchNewsController.Request): Promise<HttpResponse> {
    try {
      const dto = {
        ...parsePaginationInput({
          page: request.pageNumber,
          limit: request.limit
        }),
      }

      if (request.title) {
        Object.assign(dto, {
          title: request.title
        })
      }

      const createdOrError = await this.useCase.execute(dto);

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
    title?: string;
    // start?: string;
    // end?: string | null;
  } & IPaginationInput;
}
