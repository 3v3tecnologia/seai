import { HttpResponse } from "../ports";

import { LoginUserAccount } from "../../../@types/login-user";
import { CreateFaqCategory } from "../../../domain/use-cases/faq/create-category";
import { badRequest, created, serverError } from "../helpers";
import { ISchemaValidator } from "../../../shared/validation/validator";

export class CreateFaqCategoryController {
  constructor(
    private CreateFaqCategory: CreateFaqCategory,
    private validator: ISchemaValidator
  ) {}

  async handle(
    request: CreateFaqCategoryController.Request
  ): Promise<HttpResponse> {
    try {
      const { description, title, accountId } = request;

      const dto = {
        description,
        title,
        accountId,
      };

      const { error } = await this.validator.validate(dto);

      if (error) {
        return badRequest(error);
      }

      const result = await this.CreateFaqCategory.create(
        {
          title: title,
          description: description,
        },
        accountId
      );

      if (result.isLeft()) {
        return badRequest(result.value);
      }

      return created(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace CreateFaqCategoryController {
  export type Request = {
    title: string;
    description: string;
  } & LoginUserAccount;
}
