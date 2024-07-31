import { HttpResponse } from "../ports";

import { DeleteFaqCategory } from "../../../domain/use-cases/faq/delete-faq-category";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { badRequest, forbidden, ok, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";
import { UserOperationControllerDTO } from "../../../@types/login-user";

export class DeleteFaqCategoryController {
  private DeleteFaqCategory: DeleteFaqCategory;

  constructor(DeleteFaqCategory: DeleteFaqCategory) {
    this.DeleteFaqCategory = DeleteFaqCategory;
  }

  async handle(
    request: DeleteFaqCategoryController.Request
  ): Promise<HttpResponse> {
    try {
      if (!request.id) {
        return badRequest(new Error("É necessário informar o ID da categoria"));
      }
      const result = await this.DeleteFaqCategory.execute(request.id, {
        author: request.accountId,
        operation: request.Operation,
      });

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(`Categoria ${request.id} deletada com sucesso`);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace DeleteFaqCategoryController {
  export type Request = {
    id: number;
  } & UserOperationControllerDTO;
}
