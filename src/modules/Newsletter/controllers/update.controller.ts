import {
  badRequest,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";

import { ISchemaValidator } from "../../../shared/validation/validator";
import { UpdateNewsUseCaseProtocol } from "../services";

export class UpdateController {
  private useCase: UpdateNewsUseCaseProtocol.UseCase;
  private validator: ISchemaValidator;

  constructor(
    useCase: UpdateNewsUseCaseProtocol.UseCase,
    validator: ISchemaValidator
  ) {
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(request: UpdateController.Request): Promise<HttpResponse> {
    try {
      const {
        id,
        Data,
        Description,
        FK_Author,
        SendDate,
        Title,
        LocationName,
      } = request;

      const { error } = await this.validator.validate({
        id,
        Data,
        Description,
        FK_Author,
        SendDate,
        Title,
        LocationName,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await this.useCase.execute({
        Id: request.id,
        Data: request.Data,
        Description: request.Description,
        FK_Author: request.FK_Author,
        Title: request.Title,
        SendDate: request.SendDate,
      });

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
    FK_Author: string;
    Description: string | null;
    Data: any;
    LocationName?: string;
    SendDate: string;
  };
}
