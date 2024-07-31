import { HttpResponse } from "../ports";

import { UserOperationControllerDTO } from "../../../@types/login-user";
import { DeleteFaq } from "../../../domain/use-cases/faq/delete-faq";
import { badRequest, forbidden, ok, serverError } from "../helpers";

export class DeleteFaqController {
  private DeleteFaq: DeleteFaq;

  constructor(DeleteFaq: DeleteFaq) {
    this.DeleteFaq = DeleteFaq;
  }

  async handle(request: DeleteFaqController.Request): Promise<HttpResponse> {
    try {
      if (request.id === null || request.id === undefined) {
        return badRequest(new Error("É necessário informar o id do faq."));
      }
      const result = await this.DeleteFaq.execute(request.id, {
        author: request.accountId,
        operation: request.Operation,
      });

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(`Faq deletado com sucesso`);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace DeleteFaqController {
  export type Request = {
    id: number;
  } & UserOperationControllerDTO;
}
