import { HttpResponse } from "../../../presentation/controllers/ports";

import {
  badRequest,
  created,
  forbidden,
  serverError,
} from "../../../presentation/controllers/helpers";
import { ISchemaValidator } from "../../../shared/validation/validator";
import { CreateNews } from "../services";

export class CreateNewsController {
  private useCase: CreateNews;
  private validator: ISchemaValidator;

  constructor(useCase: CreateNews, validator: ISchemaValidator) {
    this.useCase = useCase;
    this.validator = validator;
  }

  async handle(request: CreateNewsController.Request): Promise<HttpResponse> {
    try {
      const { Data, Description, FK_Author, SendDate, Title, LocationName } =
        request;

      const { error } = await this.validator.validate({
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

      const createdOrError = await this.useCase.create({
        Data: request.Data,
        Description: request.Description,
        FK_Author: request.FK_Author,
        Title: request.Title,
        SendDate: request.SendDate,
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

export namespace CreateNewsController {
  export type Request = {
    accountId: number;
    FK_Author: number;
    Title: string;
    Description: string | null;
    Data: any;
    SendDate: string;
    LocationName?: string;
  };
}
