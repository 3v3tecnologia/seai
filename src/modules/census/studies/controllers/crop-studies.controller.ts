import { IPaginationInput } from "../../../../domain/use-cases/helpers/pagination";
import {
  badRequest,
  created,
  ok,
  serverError
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { CropStudies } from "../core/model/crop-studies";
import { ICreateCropStudiesService, IGetCropStudiesByBasinService } from "../services/crop-studies";

export interface ICreateCropStudiesController {
  handle(request: {
    accountId: number;
    id: number;
    data: Array<Omit<CropStudies, "id_basin">>;
  }): Promise<HttpResponse>
}

export class CreateCropStudiesControllers implements ICreateCropStudiesController {

  constructor(private readonly cropStudiesService: ICreateCropStudiesService) { }

  async handle(request: {
    accountId: number;
    id: number;
    data: Array<Omit<CropStudies, "id_basin">>;
  }): Promise<HttpResponse> {
    try {
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
      console.error(error);
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
  ): Promise<HttpResponse>
}
export class GetCropStudiesByBasinController implements IGetCropStudiesByBasinController {

  constructor(private readonly cropStudiesService: IGetCropStudiesByBasinService) { }

  async handle(
    request: {
      accountId: number;
      id: number;
    } & IPaginationInput
  ): Promise<HttpResponse> {
    try {
      const deletedOrError = await this.cropStudiesService.getByBasin(
        request.id
      );

      if (deletedOrError.isLeft()) {
        return badRequest(deletedOrError.value);
      }

      return ok(deletedOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}
