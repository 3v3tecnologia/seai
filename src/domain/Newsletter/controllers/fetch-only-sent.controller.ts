import { ISchemaValidator } from "../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";

import {
  IPaginationInput,
  parsePaginationInput,
} from "../../../shared/utils/pagination";
import { FetchOnlySentNews } from "../services";

export class FetchOnlySentNewsController {
  private useCase: FetchOnlySentNews.UseCase;
  private validator: ISchemaValidator;

  constructor(useCase: FetchOnlySentNews.UseCase, validator: ISchemaValidator) {
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(
    request: FetchOnlySentNewsController.Request
  ): Promise<HttpResponse> {
    try {
      const { limit, offset, pageNumber } = request;

      const params = {
        limit,
        offset,
        pageNumber,
      };

      if (Reflect.has(request, "title")) {
        Object.assign(params, {
          title: request.title,
        });
      }

      if (Reflect.has(request, "sendDate")) {
        Object.assign(params, {
          sendDate: request.sendDate,
        });
      }

      const { error } = await this.validator.validate(params);

      if (error) {
        return badRequest(error);
      }

      const dto = {
        ...params,
        ...parsePaginationInput({
          page: request.pageNumber,
          limit: request.limit,
        }),
      };

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

export namespace FetchOnlySentNewsController {
  export type Request = {
    title?: string;
    sendDate?: string;
    // start?: string;
    // end?: string | null;
  } & IPaginationInput;
}
