import { HttpResponse } from "../ports";

import { UpdateFaq } from "../../../domain/use-cases/faq/update-faq/update-faq";
import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { Validator } from "../../../shared/validation/ports/validator";
import { badRequest, forbidden, ok, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

// Controllers são classes puras e não devem depender de frameworks
export class UpdateFaqController extends CommandController<
  UpdateFaqController.Request,
  HttpResponse
> {
  private UpdateFaq: UpdateFaq;
  private validator: Validator;

  constructor(
    UpdateFaq: UpdateFaq,
    validator: Validator,
    userLogs: RegisterUserLogs
  ) {
    super(userLogs);
    this.UpdateFaq = UpdateFaq;
    this.validator = validator;
  }

  async handle(request: UpdateFaqController.Request): Promise<HttpResponse> {
    try {
      const isValidOrError = this.validator.validate(request);

      if (isValidOrError.isLeft()) {
        return badRequest(isValidOrError.value);
      }

      if (!request.id) {
        return badRequest(new Error("Id shouldn't be empty"));
      }
      if (request.categories.length === 0) {
        return badRequest(new Error("Categories shouldn't be empty"));
      }

      if (request.answer.length > 256 || request.answer.length === 0) {
        return badRequest(
          new Error(
            "Answer invalid,value shouldn't empty and max characters is equal to 256."
          )
        );
      }

      if (request.question.length > 60 || request.question.length === 0) {
        return badRequest(
          new Error(
            "Question invalid, value should be between 0 until 60 characters"
          )
        );
      }

      const result = await this.UpdateFaq.update(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      await this.userLogs.log(request.accountId, this.UpdateFaq.useCaseLogs());
      //Add validation here
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
    order: string;
    categories: Array<number>;
  };
}
