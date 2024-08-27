import { UserOperationControllerDTO } from "../../../@types/login-user";
import { ISchemaValidator } from "../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";
import { DeleteFaqCategory } from "../services/delete-faq-category";

export class DeleteFaqCategoryController {
  private DeleteFaqCategory: DeleteFaqCategory;

  constructor(
    DeleteFaqCategory: DeleteFaqCategory,
    private validator: ISchemaValidator
  ) {
    this.DeleteFaqCategory = DeleteFaqCategory;
  }

  async handle(
    request: DeleteFaqCategoryController.Request
  ): Promise<HttpResponse> {
    try {
      const { Operation, accountId, id } = request;

      const { error } = await this.validator.validate({
        Operation,
        accountId,
        id,
      });

      if (error) {
        return badRequest(error);
      }

      const result = await this.DeleteFaqCategory.execute(id, {
        author: accountId,
        operation: Operation,
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
