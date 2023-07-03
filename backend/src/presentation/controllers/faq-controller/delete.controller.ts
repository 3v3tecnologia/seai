import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { DeleteFaqProtocol } from "../../../domain/use-cases/faq/delete-faq/ports/delete-faq";
import { forbidden, ok, serverError } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class DeleteFaqController implements Controller {
  private DeleteFaq: DeleteFaqProtocol;

  constructor(DeleteFaq: DeleteFaqProtocol) {
    this.DeleteFaq = DeleteFaq;
  }

  async handle(request: DeleteFaqController.Request): Promise<HttpResponse> {
    try {
      const result = await this.DeleteFaq.delete(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      //Add validation here
      return ok(`Faq deletado com sucesso`);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace DeleteFaqController {
  export type Request = {
    id: number;
  };
}
