import {
  badRequest,
  created,
  noContent,
  ok,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { IUserIrrigationCropsServices } from "../services/protocols/user-irrigation";
import {
  DeleteIrrigationCropsRequest,
  GetAllIrrigationCropsRequest,
  GetIrrigationCropsByIdRequest,
  SaveIrrigationCropsRequest,
  UpdateIrrigationCropsRequest,
} from "./dto/irrigation-recommendation";

export class UserIrrigationControllers {
  constructor(private services: IUserIrrigationCropsServices) {}

  async create(request: SaveIrrigationCropsRequest): Promise<HttpResponse> {
    try {
      const successOrError = await this.services.saveIrrigationCrops({
        Name: request.Name,
        CropId: request.CropId,
        IrrigationEfficiency: request.IrrigationEfficiency,
        PlantingDate: request.PlantingDate,
        System: request.System,
        UserId: request.accountId,
      });

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return created(successOrError.value);
    } catch (error) {
      return badRequest(error as Error);
    }
  }

  async updateIrrigationCropsById(
    request: UpdateIrrigationCropsRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError = await this.services.updateIrrigationCropsById({
        Id: request.id,
        Name: request.Name,
        CropId: request.CropId,
        IrrigationEfficiency: request.IrrigationEfficiency,
        PlantingDate: request.PlantingDate,
        System: request.System,
        UserId: request.accountId,
      });

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return noContent();
    } catch (error) {
      return badRequest(error as Error);
    }
  }

  async deleteIrrigationCrops(
    request: DeleteIrrigationCropsRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError = await this.services.deleteIrrigationCropsById(
        request.id,
        request.accountId
      );

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return noContent();
    } catch (error) {
      return badRequest(error as Error);
    }
  }

  async getIrrigationCropsById(
    request: GetIrrigationCropsByIdRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError = await this.services.getIrrigationCropsById(
        request.id,
        request.accountId
      );

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return ok(successOrError.value);
    } catch (error) {
      return badRequest(error as Error);
    }
  }

  async getAllIrrigationCrops(
    request: GetAllIrrigationCropsRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError = await this.services.getAllIrrigationCrops(
        request.accountId
      );

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return ok(successOrError.value);
    } catch (error) {
      return badRequest(error as Error);
    }
  }
}
