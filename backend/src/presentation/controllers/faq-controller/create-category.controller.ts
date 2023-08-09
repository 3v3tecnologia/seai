import { HttpResponse } from "../ports";

import { CreateFaqCategory } from "../../../domain/use-cases/faq/create-category";
import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { badRequest, created, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class CreateFaqCategoryController extends CommandController<
  CreateFaqCategoryController.Request,
  HttpResponse
> {
  private CreateFaqCategory: CreateFaqCategory;

  constructor(
    CreateFaqCategory: CreateFaqCategory,
    userLogs: RegisterUserLogs
  ) {
    super(userLogs);
    this.CreateFaqCategory = CreateFaqCategory;
  }

  async handle(
    request: CreateFaqCategoryController.Request
  ): Promise<HttpResponse> {
    try {
      const dto = {
        title: request.title,
        description: request.description,
      };

      const result = await this.CreateFaqCategory.create(dto);

      if (result.isLeft()) {
        return badRequest(result.value);
      }
      await this.userLogs.log(request.accountId, this.CreateFaqCategory);

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
