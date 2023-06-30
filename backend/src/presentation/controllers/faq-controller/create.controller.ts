import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { CreateFaqProtocol } from "../../../domain/use-cases/faq/create-faq/ports/create-faq";
import { forbidden, ok, serverError } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class CreateFaqController implements Controller {
  private CreateFaq: CreateFaqProtocol;

  constructor(CreateFaq: CreateFaqProtocol) {
    this.CreateFaq = CreateFaq;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.CreateFaq.create({});

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

export namespace CreateFaqController {
  export type Request = {};
}
