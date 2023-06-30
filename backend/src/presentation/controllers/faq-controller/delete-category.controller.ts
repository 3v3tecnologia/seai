import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { DeleteFaqCategoryProtocol } from "../../../domain/use-cases/faq/delete-faq-category/ports/delete-faq-category";
import { forbidden, ok, serverError } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class DeleteFaqCategoryController implements Controller {
  private DeleteFaqCategory: DeleteFaqCategoryProtocol;

  constructor(DeleteFaqCategory: DeleteFaqCategoryProtocol) {
    this.DeleteFaqCategory = DeleteFaqCategory;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.DeleteFaqCategory.delete({
        id: 1,
      });

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

export namespace DeleteFaqCategoryController {
  export type Request = {};
}
