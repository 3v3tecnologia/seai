import { HttpResponse } from "../ports";

import { UserOperationControllerDTO } from "../../../@types/login-user";
import { UpdateFaqCategory } from "../../../domain/use-cases/faq/update-faq-category";
import { forbidden, ok, serverError } from "../helpers";

export class UpdateFaqCategoryController {
  private UpdateFaqCategory: UpdateFaqCategory;

  constructor(UpdateFaqCategory: UpdateFaqCategory) {
    this.UpdateFaqCategory = UpdateFaqCategory;
  }

  async handle(
    request: UpdateFaqCategoryController.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.UpdateFaqCategory.execute(
        {
          id: request.id,
          title: request.title,
          description: request.description,
        },
        {
          author: request.accountId,
          operation: request.Operation,
        }
      );

      if (result.isLeft()) {
        return forbidden(result.value);
      }

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
  } & UserOperationControllerDTO;
}
