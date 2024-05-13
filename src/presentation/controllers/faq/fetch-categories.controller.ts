import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { forbidden, ok, serverError } from "../helpers";
import { FetchFaqCategoriesProtocol } from "../../../domain/use-cases/faq/protocols/fetch-faq-categories";

export class FetchFaqCategoriesController
  implements Controller<void, HttpResponse> {
  private FetchFaq: FetchFaqCategoriesProtocol;

  constructor(FetchFaq: FetchFaqCategoriesProtocol) {
    this.FetchFaq = FetchFaq;
  }

  async handle(): Promise<HttpResponse> {
    try {
      console.log('kkk');
      const result = await this.FetchFaq.execute();

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

export namespace FetchFaqCategoriesController {
  export type Request = {};
}
