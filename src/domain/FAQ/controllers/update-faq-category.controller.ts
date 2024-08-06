import { UserOperationControllerDTO } from "../../../@types/login-user";
import { UpdateFaqCategory } from "../services/update-faq-category";
import { ISchemaValidator } from "../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";

export class UpdateFaqCategoryController {
  constructor(
    private UpdateFaqCategory: UpdateFaqCategory,
    private validator: ISchemaValidator
  ) {}

  async handle(
    request: UpdateFaqCategoryController.Request
  ): Promise<HttpResponse> {
    try {
      const { Operation, accountId, id, description, title } = request;

      const { error } = await this.validator.validate({
        Operation,
        accountId,
        id,
        description,
        title,
      });

      if (error) {
        return badRequest(error);
      }

      const result = await this.UpdateFaqCategory.execute(
        {
          id,
          title,
          description,
        },
        {
          author: accountId,
          operation: Operation,
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

export namespace UpdateFaqCategoryController {
  export type Request = {
    id: number;
    title: string;
    description: string;
  } & UserOperationControllerDTO;
}
