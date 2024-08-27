import { LoginUserAccount } from "../../../@types/login-user";
import { ISchemaValidator } from "../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  created,
  forbidden,
  serverError,
} from "../../../shared/utils/http-responses";
import { CreateFaq } from "../services/create-faq";

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
