import { LoginUserAccount } from "../../../@types/login-user";
import { ISchemaValidator } from "../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  created,
  serverError,
} from "../../../shared/utils/http-responses";

import { CreateFaqCategory } from "../services/create-category";

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
