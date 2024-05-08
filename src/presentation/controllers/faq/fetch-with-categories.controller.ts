import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { forbidden, ok, serverError } from "../helpers";
import { GetFaqsUseCaseProtocol } from "../../../domain/use-cases/faq/fetch-all-faq/protocol";
import { IPaginationInput, parsePaginationInput } from "../../../domain/use-cases/helpers/pagination";

export class FetchFaqWithCategoriesController
  implements Controller<FetchFaqWithCategoryControllerProtocol.Request, HttpResponse> {
  private FetchFaqs: GetFaqsUseCaseProtocol.UseCase;

  constructor(FetchFaq: GetFaqsUseCaseProtocol.UseCase) {
    this.FetchFaqs = FetchFaq;
  }

  async handle(request: FetchFaqWithCategoryControllerProtocol.Request): Promise<HttpResponse> {
    try {
      const dto = {
        ...parsePaginationInput({
          page: request.pageNumber, limit: request.limit
        }),
      };

      if (request.id_category) {
        Object.assign(dto, {
          id_category: request.id_category
        })
      }

      if (request.question) {
        Object.assign(dto, {
          question: request.question
        })
      }

      const result = await this.FetchFaqs.execute(dto);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchFaqWithCategoryControllerProtocol {
  export type Request = { id_category?: number, question?: string } & IPaginationInput;
}
