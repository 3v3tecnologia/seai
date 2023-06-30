import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { CreateFaqProtocol } from "../../../domain/use-cases/faq/create-faq/ports/create-faq";
import { badRequest, created, forbidden, ok, serverError } from "../helpers";
import { Validator } from "../../../shared/validation/ports/validator";

// Controllers são classes puras e não devem depender de frameworks
export class CreateFaqController implements Controller {
  private CreateFaq: CreateFaqProtocol;
  private validator: Validator;

  constructor(CreateFaq: CreateFaqProtocol, validator: Validator) {
    this.CreateFaq = CreateFaq;
    this.validator = validator;
  }

  async handle(request: CreateFaqController.Request): Promise<HttpResponse> {
    try {
      // é de suma importância haver uma validação tanto do question como também de answers
      // [] - question não pode ser repetido e nem superior do que 60 caracteres
      // [] - answer não pode ser maior de que 256 caracteres
      // [] - nenhum deles devem serem nulos
      const isValidOrError = this.validator.validate(request);

      if (isValidOrError.isLeft()) {
        return badRequest(isValidOrError.value);
      }

      //Avaliar necessidade de criar um domínio
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

      const result = await this.CreateFaq.create(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      //Add validation here
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
    order: string;
    categories: Array<number>;
  };
}
