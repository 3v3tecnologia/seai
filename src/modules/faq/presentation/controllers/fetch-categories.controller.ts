import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { forbidden, ok, serverError } from "../../../../presentation/controllers/helpers";
import { FetchFaqCategoriesProtocol } from "../../services/protocols/fetch-faq-categories";

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
