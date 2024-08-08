import { Controller } from "../../../shared/ports/controllers";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  forbidden,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";
import { FetchFaqCategoriesProtocol } from "../services/protocols/fetch-faq-categories";

export class FetchFaqCategoriesController
  implements Controller<void, HttpResponse>
{
  private FetchFaq: FetchFaqCategoriesProtocol;

  constructor(FetchFaq: FetchFaqCategoriesProtocol) {
    this.FetchFaq = FetchFaq;
  }

  async handle(): Promise<HttpResponse> {
    try {
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
