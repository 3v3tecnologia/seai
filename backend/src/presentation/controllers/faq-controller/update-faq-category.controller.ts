import { HttpResponse } from "../ports";

import { UpdateFaqCategory } from "../../../domain/use-cases/faq/update-faq-category/update-faq-category";
import { RegisterUserLogs } from "../../../domain/use-cases/logs/register-user-logs";
import { Validator } from "../../../shared/validation/ports/validator";
import { badRequest, forbidden, ok, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

// Controllers são classes puras e não devem depender de frameworks
export class UpdateFaqCategoryController extends CommandController<
  UpdateFaqCategoryController.Request,
  HttpResponse
> {
  private UpdateFaqCategory: UpdateFaqCategory;
  private validator: Validator;

  constructor(
    UpdateFaqCategory: UpdateFaqCategory,
    validator: Validator,
    userLogs: RegisterUserLogs
  ) {
    super(userLogs);
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

      await this.userLogs.log(
        request.accountId,
        this.UpdateFaqCategory.useCaseLogs()
      );
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
    accountId: number;
    id: number;
    title: string;
    description: string;
  };
}
