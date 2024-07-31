import { HttpResponse } from "../ports";

import { UserOperationControllerDTO } from "../../../@types/login-user";
import { UpdateFaq } from "../../../domain/use-cases/faq/update-faq";
import { forbidden, ok, serverError } from "../helpers";

export class UpdateFaqController {
  private UpdateFaq: UpdateFaq;

  constructor(UpdateFaq: UpdateFaq) {
    this.UpdateFaq = UpdateFaq;
  }

  async handle(request: UpdateFaqController.Request): Promise<HttpResponse> {
    try {
      const result = await this.UpdateFaq.execute(
        {
          id: request.id,
          answer: request.answer,
          question: request.question,
          order: request.order,
          id_category: request.id_category,
        },
        {
          author: request.accountId,
          operation: request.Operation,
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
    order: number;
    id_category: number;
  } & UserOperationControllerDTO;
}
