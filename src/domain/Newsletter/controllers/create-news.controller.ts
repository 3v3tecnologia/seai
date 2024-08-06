import { ISchemaValidator } from "../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  created,
  forbidden,
  serverError,
} from "../../../shared/utils/http-responses";
import { CreateNewsUseCaseProtocol } from "../services";

export class CreateNewsController {
  private useCase: CreateNewsUseCaseProtocol;
  private validator: ISchemaValidator;

  constructor(useCase: CreateNewsUseCaseProtocol, validator: ISchemaValidator) {
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(request: CreateNewsController.Request): Promise<HttpResponse> {
    try {
      const { Data, Description, SendDate, Title, accountId } = request;

      const dto = {
        Data,
        Description,
        SendDate,
        Title,
        accountId,
      };

      const { error } = await this.validator.validate(dto);

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await this.useCase.execute(dto);

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return created(createdOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace CreateNewsController {
  export type Request = {
    accountId: number;
    Title: string;
    Description: string | null;
    Data: any;
    SendDate: string;
  };
}
