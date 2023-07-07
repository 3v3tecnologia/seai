import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { CreateFaqCategory } from "../../../domain/use-cases/faq/create-category";
import { RegisterUserLogs } from "../../../domain/use-cases/logs/register-user-logs";
import { Validator } from "../../../shared/validation/ports/validator";
import { badRequest, created, serverError } from "../helpers";

// Controllers são classes puras e não devem depender de frameworks
export class CreateFaqCategoryController implements Controller {
  private CreateFaqCategory: CreateFaqCategory;
  private validator: Validator;
  private userLogs: RegisterUserLogs;

  constructor(
    CreateFaqCategory: CreateFaqCategory,
    validator: Validator,
    userLogs: RegisterUserLogs
  ) {
    this.CreateFaqCategory = CreateFaqCategory;
    this.userLogs = userLogs;
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
      await this.userLogs.log(
        request.accountId,
        this.CreateFaqCategory.useCaseLogs()
      );
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
    accountId: number;
    title: string;
    description: string;
  };
}
