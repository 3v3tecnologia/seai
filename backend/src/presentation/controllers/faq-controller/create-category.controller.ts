import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { CreateFaqCategoryProtocol } from "../../../domain/use-cases/faq/create-category/ports/create-faq-category";
import { forbidden, ok, serverError } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class CreateFaqCategoryController implements Controller {
  private CreateFaqCategory: CreateFaqCategoryProtocol;

  constructor(CreateFaqCategory: CreateFaqCategoryProtocol) {
    this.CreateFaqCategory = CreateFaqCategory;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.CreateFaqCategory.create({});

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

export namespace CreateFaqCategoryController {
  export type Request = {};
}
