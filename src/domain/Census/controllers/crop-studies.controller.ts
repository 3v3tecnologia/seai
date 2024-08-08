import { ISchemaValidator } from "../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  created,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";
import { Logger } from "../../../shared/utils/logger";
import { IPaginationInput } from "../../../shared/utils/pagination";

import { CropStudies } from "../core/model/crop-studies";
import {
  ICreateCropStudiesService,
  IGetCropStudiesByBasinService,
} from "../services/crop-studies";

export interface ICreateCropStudiesController {
  handle(request: {
    accountId: number;
    id: number;
    data: Array<Omit<CropStudies, "id_basin">>;
  }): Promise<HttpResponse>;
}

export class CreateCropStudiesControllers
  implements ICreateCropStudiesController
{
  constructor(
    private readonly cropStudiesService: ICreateCropStudiesService,
    private readonly validator: ISchemaValidator
  ) {}

  async handle(request: {
    accountId: number;
    id: number;
    data: Array<Omit<CropStudies, "id_basin">>;
  }): Promise<HttpResponse> {
    try {
      const { data, id } = request;

      const { error } = await this.validator.validate({ id, data });

      if (error) {
        return badRequest(error);
      }

      const successOrError = await this.cropStudiesService.create({
        id_basin: request.id,
        data: request.data,
      });

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      //   await this.userLogs.log(request.accountId, this.useCase);

      return created(successOrError.value);
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(error.message);
      }
      return serverError(error as Error);
    }
  }
}

export interface IGetCropStudiesByBasinController {
  handle(
    request: {
      accountId: number;
      id: number;
    } & IPaginationInput
  ): Promise<HttpResponse>;
}
export class GetCropStudiesByBasinController
  implements IGetCropStudiesByBasinController
{
  constructor(
    private readonly cropStudiesService: IGetCropStudiesByBasinService,
    private readonly validator: ISchemaValidator
  ) {}

  async handle(
    request: {
      accountId: number;
      id: number;
    } & IPaginationInput
  ): Promise<HttpResponse> {
    try {
      const { id } = request;

      const { error } = await this.validator.validate({ id });

      if (error) {
        return badRequest(error);
      }

      const deletedOrError = await this.cropStudiesService.getByBasin(
        request.id
      );

      if (deletedOrError.isLeft()) {
        return badRequest(deletedOrError.value);
      }

      return ok(deletedOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
