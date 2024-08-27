import { UserOperationControllerDTO } from "../../../@types/login-user";
import { ISchemaValidator } from "../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";
import { UpdateNewsUseCaseProtocol } from "../services";

export class UpdateController {
  private useCase: UpdateNewsUseCaseProtocol;
  private validator: ISchemaValidator;

  constructor(useCase: UpdateNewsUseCaseProtocol, validator: ISchemaValidator) {
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(request: UpdateController.Request): Promise<HttpResponse> {
    try {
      const { id, Data, Description, SendDate, Title, Operation, accountId } =
        request;

      const { error } = await this.validator.validate({
        id,
        Data,
        Description,
        SendDate,
        Title,
        Operation,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await this.useCase.execute(
        {
          Id: request.id,
          Data: request.Data,
          Description: request.Description,
          Title: request.Title,
          SendDate: request.SendDate,
        },
        {
          author: accountId,
          operation: Operation,
        }
      );

      if (createdOrError.isLeft()) {
        return badRequest(createdOrError.value);
      }

      return ok(createdOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace UpdateController {
  export type Request = {
    accountId: number;
    id: number;
    Title: string;
    Description: string | null;
    Data: any;
    SendDate: string;
  } & UserOperationControllerDTO;
}
