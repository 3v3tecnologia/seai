import { HttpResponse } from "../ports";

import { LoginUserAccount } from "../../../@types/login-user";
import { CreateFaq } from "../../../domain/use-cases/faq/create-faq";
import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { created, forbidden, serverError } from "../helpers";

export class CreateFaqController {
  private CreateFaq: CreateFaq;

  constructor(CreateFaq: CreateFaq) {
    this.CreateFaq = CreateFaq;
  }

  async handle(request: CreateFaqController.Request): Promise<HttpResponse> {
    try {
      const result = await this.CreateFaq.execute(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return created(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace CreateFaqController {
  export type Request = {
    question: string;
    answer: string;
    order: number;
    id_category: number;
  } & LoginUserAccount;
}
