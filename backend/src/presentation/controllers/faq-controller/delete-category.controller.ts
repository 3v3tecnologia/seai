import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { DeleteFaqCategoryProtocol } from "../../../domain/use-cases/faq/delete-faq-category/ports/delete-faq-category";
import { forbidden, noContent, serverError, ok, badRequest } from "../helpers";
import { RegisterUserLogs } from "../../../domain/use-cases/logs/register-user-logs";
import { DeleteFaqCategory } from "../../../domain/use-cases/faq/delete-faq-category/delete-faq-category";

// Controllers são classes puras e não devem depender de frameworks
export class DeleteFaqCategoryController implements Controller {
  private DeleteFaqCategory: DeleteFaqCategory;
  private userLogs: RegisterUserLogs;

  constructor(
    DeleteFaqCategory: DeleteFaqCategory,
    userLogs: RegisterUserLogs
  ) {
    this.DeleteFaqCategory = DeleteFaqCategory;
    this.userLogs = userLogs;
  }

  async handle(
    request: DeleteFaqCategoryController.Request
  ): Promise<HttpResponse> {
    try {
      if (!request.id) {
        return badRequest(new Error("É necessário informar o ID da categoria"));
      }
      const result = await this.DeleteFaqCategory.delete({
        id_category: request.id,
      });

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      await this.userLogs.log(
        request.accountId,
        this.DeleteFaqCategory.useCaseLogs()
      );
      //Add validation here
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
