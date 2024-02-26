import { HttpResponse } from "../ports";

import { CreateFaq } from "../../../domain/use-cases/faq/create-faq/create-faq";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class CreateFaqController extends CommandController<
  CreateFaqController.Request,
  HttpResponse
> {
  private CreateFaq: CreateFaq;

  constructor(CreateFaq: CreateFaq, userLogs: RegisterUserLogs) {
    super(userLogs);
    this.CreateFaq = CreateFaq;
  }

  async handle(request: CreateFaqController.Request): Promise<HttpResponse> {
    try {
      const result = await this.CreateFaq.create(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      await this.userLogs.log(request.accountId, this.CreateFaq);

      return created(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace CreateFaqController {
  export type Request = {
    accountId: number;
    question: string;
    answer: string;
    order: number;
    categories: Array<number>;
  };
}
