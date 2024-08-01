import { HttpResponse } from "../ports";

import { LoginUserAccount } from "../../../@types/login-user";
import { CreateFaq } from "../../../domain/use-cases/faq/create-faq";
import { badRequest, created, forbidden, serverError } from "../helpers";
import { ISchemaValidator } from "../../../shared/validation/validator";

export class CreateFaqController {
  constructor(
    private CreateFaq: CreateFaq,
    private validator: ISchemaValidator
  ) {}

  async handle(request: CreateFaqController.Request): Promise<HttpResponse> {
    try {
      const { answer, question, id_category, accountId } = request;

      const dto = {
        answer,
        question,
        id_category,
        accountId,
      };

      const { error } = await this.validator.validate(dto);

      if (error) {
        return badRequest(error);
      }

      const result = await this.CreateFaq.execute(dto);

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
    id_category: number;
  } & LoginUserAccount;
}
