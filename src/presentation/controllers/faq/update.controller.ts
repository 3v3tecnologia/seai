import { HttpResponse } from "../ports";

import { UserOperationControllerDTO } from "../../../@types/login-user";
import { UpdateFaq } from "../../../domain/use-cases/faq/update-faq";
import { badRequest, forbidden, ok, serverError } from "../helpers";
import { ISchemaValidator } from "../../../shared/validation/validator";

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
