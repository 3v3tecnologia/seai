import { HttpResponse } from "../../../../shared/presentation/ports";

import { CreateFaqCategory } from "../../services/create-category";
import { RegisterUserLogs } from "../../../system-logs/services/register-user-logs";
import { badRequest, created, serverError } from "../../../../presentation/controllers/helpers";
import { CommandController } from "../../../../shared/presentation/command-controller";

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
