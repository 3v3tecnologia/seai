import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { CreateFaqCategoryProtocol } from "../../../domain/use-cases/faq/create-category/ports/create-faq-category";
import { badRequest, forbidden, ok, serverError } from "../helpers";
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
        return badRequest(new Error("Title shouldn't be empty"));
      }
      if (request.description.length === 0) {
        return badRequest(new Error("Description shouldn't be empty"));
      }

      const result = await this.CreateFaqCategory.create(request);

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
  export type Request = {
    title: string;
    description: string;
  };
}
