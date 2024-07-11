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
import {
  createUserIrrigationValidator,
  deleteUserIrrigationValidator,
  getAllUserRecommendationsValidator,
  getUserIrrigationCropsByIdValidator,
  updateUserIrrigationValidator,
} from "./schema/user-irrigation";

export class UserIrrigationControllers {
  constructor(private services: IUserIrrigationCropsServices) {}

  async create(request: SaveIrrigationCropsRequest): Promise<HttpResponse> {
    try {
      const {
        accountId,
        CropId,
        IrrigationEfficiency,
        Name,
        PlantingDate,
        System,
      } = request;

      const { error } = await createUserIrrigationValidator.validate({
        accountId,
        CropId,
        IrrigationEfficiency,
        Name,
        PlantingDate,
        System,
      });

      if (error) {
        return badRequest(error);
      }

      const successOrError = await this.services.saveIrrigationCrops({
        UserId: accountId,
        Name: Name,
        CropId: CropId,
        IrrigationEfficiency: IrrigationEfficiency,
        PlantingDate: PlantingDate,
        System: System,
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
      const {
        id,
        accountId,
        CropId,
        IrrigationEfficiency,
        Name,
        PlantingDate,
        System,
      } = request;

      const { error } = await updateUserIrrigationValidator.validate({
        id,
        accountId,
        CropId,
        IrrigationEfficiency,
        Name,
        PlantingDate,
        System,
      });

      if (error) {
        return badRequest(error);
      }

      const successOrError = await this.services.updateIrrigationCropsById({
        Id: id,
        UserId: accountId,
        Name: Name,
        CropId: request.CropId,
        IrrigationEfficiency: IrrigationEfficiency,
        PlantingDate: PlantingDate,
        System: System,
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
      const { id, accountId } = request;

      const { error } = await deleteUserIrrigationValidator.validate({
        id,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const successOrError = await this.services.deleteIrrigationCropsById(
        id,
        accountId
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
      const { id, accountId } = request;

      const { error } = await getUserIrrigationCropsByIdValidator.validate({
        id,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const successOrError = await this.services.getIrrigationCropsById(
        id,
        accountId
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
      const { accountId } = request;

      const { error } = await getAllUserRecommendationsValidator.validate({
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const successOrError = await this.services.getAllIrrigationCrops(
        accountId
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
