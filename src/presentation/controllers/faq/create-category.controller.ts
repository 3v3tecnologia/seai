import { HttpResponse } from "../ports";

import { LoginUserAccount } from "../../../@types/login-user";
import { CreateFaqCategory } from "../../../domain/use-cases/faq/create-category";
import { badRequest, created, serverError } from "../helpers";

export class CreateFaqCategoryController {
  private CreateFaqCategory: CreateFaqCategory;

  constructor(CreateFaqCategory: CreateFaqCategory) {
    this.CreateFaqCategory = CreateFaqCategory;
  }

  async handle(
    request: CreateFaqCategoryController.Request
  ): Promise<HttpResponse> {
    try {
      const result = await this.CreateFaqCategory.create(
        {
          title: request.title,
          description: request.description,
        },
        request.accountId
      );

      if (result.isLeft()) {
        return badRequest(result.value);
      }

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
  } & LoginUserAccount;
}
