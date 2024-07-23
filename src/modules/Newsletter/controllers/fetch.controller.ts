import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";

import {
  IPaginationInput,
  parsePaginationInput,
} from "../../../domain/use-cases/helpers/pagination";

import { ISchemaValidator } from "../../../shared/validation/validator";
import { FetchAllNews } from "../services";

export class FetchNewsController {
  private useCase: FetchAllNews.UseCase;
  private validator: ISchemaValidator;

  constructor(useCase: FetchAllNews.UseCase, validator: ISchemaValidator) {
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(request: FetchNewsController.Request): Promise<HttpResponse> {
    try {
      const { limit, offset, pageNumber } = request;

      const toValidate = {
        limit,
        offset,
        pageNumber,
      };

      if (Reflect.has(request, "title")) {
        Object.assign(toValidate, {
          title: request.title,
        });
      }

      const { error } = await this.validator.validate(toValidate);

      if (error) {
        return badRequest(error);
      }

      const dto = {
        ...parsePaginationInput({
          page: request.pageNumber,
          limit: request.limit,
        }),
      };

      if (request.title) {
        Object.assign(dto, {
          title: request.title,
        });
      }

      const createdOrError = await this.useCase.execute(dto);

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return ok(createdOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchNewsController {
  export type Request = {
    title?: string;
    // start?: string;
    // end?: string | null;
  } & IPaginationInput;
}
