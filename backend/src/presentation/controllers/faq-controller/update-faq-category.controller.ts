import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { UpdateFaqCategoryProtocol } from "../../../domain/use-cases/faq/update-faq-category/ports/update-faq-category";
import { Validator } from "../../../shared/validation/ports/validator";
import { badRequest, forbidden, ok, serverError } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class UpdateFaqCategoryController implements Controller {
  private UpdateFaqCategory: UpdateFaqCategoryProtocol;
  private validator: Validator;

  constructor(
    UpdateFaqCategory: UpdateFaqCategoryProtocol,
    validator: Validator
  ) {
    this.UpdateFaqCategory = UpdateFaqCategory;
    this.validator = validator;
  }

  async handle(
    request: UpdateFaqCategoryController.Request
  ): Promise<HttpResponse> {
    try {
      const isValidOrError = this.validator.validate(request);

      if (isValidOrError.isLeft()) {
        return badRequest(isValidOrError.value);
      }

      if (!request.id) {
        return badRequest(new Error("Id é obrigatório"));
      }

      if (request.title.length === 0) {
        return badRequest(new Error("Título é obrigatório"));
      }
      if (request.description.length === 0) {
        return badRequest(new Error("Descrição é obrigatório"));
      }

      const result = await this.UpdateFaqCategory.update(request);

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

export namespace UpdateFaqCategoryController {
  export type Request = {
    id: number;
    title: string;
    description: string;
  };
}
