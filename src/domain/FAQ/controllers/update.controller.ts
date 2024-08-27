import { UserOperationControllerDTO } from "../../../@types/login-user";
import { UpdateFaq } from "../services/update-faq";
import { ISchemaValidator } from "../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";

export class UpdateFaqController {
  constructor(
    private UpdateFaq: UpdateFaq,
    private validator: ISchemaValidator
  ) {}

  async handle(request: UpdateFaqController.Request): Promise<HttpResponse> {
    try {
      const { answer, question, id_category, accountId, Operation, id } =
        request;

      const { error } = await this.validator.validate({
        answer,
        question,
        id_category,
        accountId,
        Operation,
        id,
      });

      if (error) {
        return badRequest(error);
      }

      const result = await this.UpdateFaq.execute(
        {
          id,
          answer,
          question,
          id_category,
        },
        {
          author: accountId,
          operation: Operation,
        }
      );

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace UpdateFaqController {
  export type Request = {
    id: number;
    question: string;
    answer: string;
    id_category: number;
  } & UserOperationControllerDTO;
}
