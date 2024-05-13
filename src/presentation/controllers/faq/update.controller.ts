import { HttpResponse } from "../ports";

import { UpdateFaq } from "../../../domain/use-cases/faq/update-faq";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { forbidden, ok, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class UpdateFaqController extends CommandController<
  UpdateFaqController.Request,
  HttpResponse
> {
  private UpdateFaq: UpdateFaq;

  constructor(UpdateFaq: UpdateFaq, userLogs: RegisterUserLogs) {
    super(userLogs);
    this.UpdateFaq = UpdateFaq;
  }

  async handle(request: UpdateFaqController.Request): Promise<HttpResponse> {
    try {
      const dto = {
        id: request.id,
        answer: request.answer,
        question: request.question,
        order: request.order,
        id_category: request.id_category,
      };

      const result = await this.UpdateFaq.execute(dto);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      await this.userLogs.log(request.accountId, this.UpdateFaq);

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace UpdateFaqController {
  export type Request = {
    accountId: number;
    id: number;
    question: string;
    answer: string;
    order: number;
    id_category: number;
  };
}
