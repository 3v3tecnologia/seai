import { UserOperationControllerDTO } from "../../../@types/login-user";
import {
  badRequest,
  created,
  forbidden,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";

import { ISchemaValidator } from "../../../shared/validation/validator";
import { DeleteNewsUseCaseProtocol } from "../services";

export class DeleteNewsController {
  private useCase: DeleteNewsUseCaseProtocol;
  private validator: ISchemaValidator;

  constructor(useCase: DeleteNewsUseCaseProtocol, validator: ISchemaValidator) {
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(request: DeleteNewsController.Request): Promise<HttpResponse> {
    try {
      const { id, Operation, accountId } = request;

      const { error } = await this.validator.validate({
        id,
        Operation,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await this.useCase.execute(request.id, {
        author: accountId,
        operation: Operation,
      });

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

export namespace DeleteNewsController {
  export type Request = {
    id: number;
  } & UserOperationControllerDTO;
}
