import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchFaqWithCategoriesProtocol } from "../../../domain/use-cases/faq/fetch-faq-with-categories/ports/fetch-faq-with-categories";
import { forbidden, ok, serverError } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class FetchFaqWithCategoriesController implements Controller {
  private FetchFaq: FetchFaqWithCategoriesProtocol;

  constructor(FetchFaq: FetchFaqWithCategoriesProtocol) {
    this.FetchFaq = FetchFaq;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.FetchFaq.fetch();

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      //Add validation here
      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchFaqByCategoryController {
  export type Request = {};
}