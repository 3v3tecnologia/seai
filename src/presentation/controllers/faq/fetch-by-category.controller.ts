import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchFaqByCategoryProtocol } from "../../../domain/use-cases/faq/fetch-faq-by-category/ports/fetch-faq-by-category";
import { forbidden, ok, serverError } from "../helpers";

export class FetchFaqByCategoryController
  implements Controller<FetchFaqByCategoryController.Request, HttpResponse>
{
  private FetchFaq: FetchFaqByCategoryProtocol;

  constructor(FetchFaq: FetchFaqByCategoryProtocol) {
    this.FetchFaq = FetchFaq;
  }

  async handle(
    request: FetchFaqByCategoryController.Request
  ): Promise<HttpResponse> {
    try {
      const id_category = request.id;
      const result = await this.FetchFaq.fetch({ id_category });

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

export namespace FetchFaqByCategoryController {
  export type Request = {
    id: number;
  };
}
