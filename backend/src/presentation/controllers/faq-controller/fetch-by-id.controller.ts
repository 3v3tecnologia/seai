import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchFaqByIdProtocol } from "../../../domain/use-cases/faq/fetch-faq-by-id/ports/fetch-faq-by-id";
import { badRequest, forbidden, ok, serverError } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class FetchFaqByIdController
  implements Controller<FetchFaqByIdController.Request, HttpResponse>
{
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
      const result = await this.FetchFaq.fetch({ id_faq: Number(id_faq) });

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

export namespace FetchFaqByIdController {
  export type Request = {
    id: number;
  };
}
