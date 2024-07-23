import {
  badRequest,
  created,
  forbidden,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import {
  IPaginationInput,
  parsePaginationInput,
} from "../../../domain/use-cases/helpers/pagination";
import { ISchemaValidator } from "../../../shared/validation/validator";
import { FetchSubscribersUseCaseProtocol } from "../services";

export class FetchNewsletterSubscribersController {
  private useCase: FetchSubscribersUseCaseProtocol.UseCase;
  private validator: ISchemaValidator;

  constructor(
    useCase: FetchSubscribersUseCaseProtocol.UseCase,
    validator: ISchemaValidator
  ) {
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(
    request: FetchNewsletterSubscribersControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const { limit, offset, pageNumber } = request;

      const toValidate = {
        limit,
        offset,
        pageNumber,
      };

      if (Reflect.has(request, "email")) {
        Object.assign(toValidate, {
          email: request.email,
        });
      }
      if (Reflect.has(request, "name")) {
        Object.assign(toValidate, {
          name: request.name,
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

      if (request.name) {
        Object.assign(dto, {
          name: request.name,
        });
      }

      if (request.email) {
        Object.assign(dto, {
          email: request.email,
        });
      }
      const resultOrError = await this.useCase.execute(dto);

      if (resultOrError.isLeft()) {
        return forbidden(resultOrError.value);
      }

      return created(resultOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchNewsletterSubscribersControllerProtocol {
  export type Request = { email?: string; name?: string } & IPaginationInput;
}