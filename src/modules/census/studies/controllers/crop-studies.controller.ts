import { IPaginationInput } from "../../../../domain/use-cases/helpers/pagination";
import {
  badRequest,
  created,
  ok,
  serverError
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { CropStudies } from "../core/model/crop-studies";
import { ICropStudiesServices, makeCropStudiesServices } from "../services/crop-studies";


export class CropStudiesControllers implements ICropStudiesControllers {

  constructor(private readonly cropStudiesServices: ICropStudiesServices) { }

  async create(request: {
    accountId: number;
    id: number;
    data: Array<Omit<CropStudies, "id_basin">>;
  }): Promise<HttpResponse> {
    try {
      const successOrError = await this.cropStudiesServices.create({
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

  async getByBasin(
    request: {
      accountId: number;
      id: number;
    } & IPaginationInput
  ): Promise<HttpResponse> {
    try {
      const deletedOrError = await this.cropStudiesServices.getByBasin(
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

export interface ICropStudiesControllers {
  create(request: {
    accountId: number;
    id: number;
    data: Array<Omit<CropStudies, "id_basin">>;
  }): Promise<HttpResponse>
  getByBasin(
    request: {
      accountId: number;
      id: number;
    } & IPaginationInput
  ): Promise<HttpResponse>
}

export const makeCensusStudiesControllers = () => new CropStudiesControllers(makeCropStudiesServices())