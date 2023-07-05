import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { CreateFaqCategoryProtocol } from "../../../domain/use-cases/faq/create-category/ports/create-faq-category";
import { badRequest, created, forbidden, ok, serverError } from "../helpers";
import { Validator } from "../../../shared/validation/ports/validator";

// Controllers são classes puras e não devem depender de frameworks
export class CreateFaqCategoryController implements Controller {
  private CreateFaqCategory: CreateFaqCategoryProtocol;
  private validator: Validator;

  constructor(
    CreateFaqCategory: CreateFaqCategoryProtocol,
    validator: Validator
  ) {
    this.CreateFaqCategory = CreateFaqCategory;
    this.validator = validator;
  }

  async handle(
    request: CreateFaqCategoryController.Request
  ): Promise<HttpResponse> {
    try {
      const isValidOrError = this.validator.validate(request);

      if (isValidOrError.isLeft()) {
        return badRequest(isValidOrError.value);
      }

      if (request.title.length === 0) {
        return badRequest(new Error("Titulo não deve ser vazio"));
      }
      if (request.description.length === 0) {
        return badRequest(new Error("Descrição não deve ser vazia"));
      }

      const result = await this.CreateFaqCategory.create(request);

      if (result.isLeft()) {
        return badRequest(result.value);
      }
      //Add validation here
      return created(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace CreateFaqCategoryController {
  export type Request = {
    title: string;
    description: string;
  };
}
