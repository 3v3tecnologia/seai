import { UserOperationControllerDTO } from "../../../@types/login-user";
import { DeleteFaq } from "../services/delete-faq";
import { ISchemaValidator } from "../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";

export class DeleteFaqController {
  constructor(
    private DeleteFaq: DeleteFaq,
    private validator: ISchemaValidator
  ) {}

  async handle(request: DeleteFaqController.Request): Promise<HttpResponse> {
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

      const result = await this.DeleteFaq.execute(id, {
        author: accountId,
        operation: Operation,
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
