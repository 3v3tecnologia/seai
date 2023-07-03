import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchFaqCategoriesProtocol } from "../../../domain/use-cases/faq/fetch-faq-categories/ports/fetch-faq-categories";
import { created, forbidden, serverError, ok } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class FetchFaqCategoriesController implements Controller {
  private FetchFaq: FetchFaqCategoriesProtocol;

  constructor(FetchFaq: FetchFaqCategoriesProtocol) {
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

export namespace FetchFaqCategoriesController {
  export type Request = {};
}
