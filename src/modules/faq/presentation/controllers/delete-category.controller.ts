import { HttpResponse } from "../../../../shared/presentation/ports";

import { DeleteFaqCategory } from "../../services/delete-faq-category";
import { RegisterUserLogs } from "../../../logs/services/register-user-logs";
import { badRequest, forbidden, ok, serverError } from "../../../../presentation/controllers/helpers";
import { CommandController } from "../../../../shared/presentation/command-controller";

export class DeleteFaqCategoryController extends CommandController<
  DeleteFaqCategoryController.Request,
  HttpResponse
> {
  private DeleteFaqCategory: DeleteFaqCategory;

  constructor(
    DeleteFaqCategory: DeleteFaqCategory,
    userLogs: RegisterUserLogs
  ) {
    super(userLogs);
    this.DeleteFaqCategory = DeleteFaqCategory;
  }

  async handle(
    request: DeleteFaqCategoryController.Request
  ): Promise<HttpResponse> {
    try {
      if (!request.id) {
        return badRequest(new Error("É necessário informar o ID da categoria"));
      }
      const result = await this.DeleteFaqCategory.execute({
        id_category: request.id,
      });

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      await this.userLogs.log(request.accountId, this.DeleteFaqCategory);

      return ok(`Categoria ${request.id} deletada com sucesso`);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace DeleteFaqCategoryController {
  export type Request = {
    accountId: number;
    id: number;
  };
}
