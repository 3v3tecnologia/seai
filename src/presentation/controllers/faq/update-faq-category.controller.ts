import { HttpResponse } from "../ports";

import { UpdateFaqCategory } from "../../../domain/use-cases/faq/update-faq-category";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { forbidden, ok, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class UpdateFaqCategoryController extends CommandController<
  UpdateFaqCategoryController.Request,
  HttpResponse
> {
  private UpdateFaqCategory: UpdateFaqCategory;

  constructor(
    UpdateFaqCategory: UpdateFaqCategory,
    userLogs: RegisterUserLogs
  ) {
    super(userLogs);
    this.UpdateFaqCategory = UpdateFaqCategory;
  }

  async handle(
    request: UpdateFaqCategoryController.Request
  ): Promise<HttpResponse> {
    try {
      const dto = {
        id: request.id,
        title: request.title,
        description: request.description,
      };
      const result = await this.UpdateFaqCategory.execute(dto);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      await this.userLogs.log(request.accountId, this.UpdateFaqCategory);

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
