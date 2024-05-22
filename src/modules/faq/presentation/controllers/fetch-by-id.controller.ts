import { HttpResponse } from "../../../../shared/presentation/ports";
import { Controller } from "../../../../shared/presentation/controllers";

import { FetchFaqByIdProtocol } from "../../services/protocols/fetch-faq-by-id";
import { badRequest, forbidden, ok, serverError } from "../../../../presentation/controllers/helpers";

export class FetchFaqByIdController
  implements Controller<FetchFaqByIdController.Request, HttpResponse> {
  private FetchFaq: FetchFaqByIdProtocol;

  constructor(FetchFaq: FetchFaqByIdProtocol) {
    this.FetchFaq = FetchFaq;
  }

  async handle(request: FetchFaqByIdController.Request): Promise<HttpResponse> {
    try {
      const id_faq = request.id;
      if (!id_faq) {
        return badRequest(new Error("Id do FAQ é obrigatório"));
      }
      const result = await this.FetchFaq.execute({ id_faq: Number(id_faq) });

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

export namespace FetchFaqByIdController {
  export type Request = {
    id: number;
  };
}
