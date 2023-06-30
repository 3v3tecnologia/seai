import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { UpdateFaqProtocol } from "../../../domain/use-cases/faq/update-faq/ports/update-faq";
import { forbidden, ok, serverError } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class UpdateFaqController implements Controller {
  private UpdateFaq: UpdateFaqProtocol;

  constructor(UpdateFaq: UpdateFaqProtocol) {
    this.UpdateFaq = UpdateFaq;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.UpdateFaq.update();

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

export namespace UpdateFaqController {
  export type Request = {};
}
