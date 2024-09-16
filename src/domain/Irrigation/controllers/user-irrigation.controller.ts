import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  created,
  noContent,
  ok,
} from "../../../shared/utils/http-responses";
import { userIrrigationService } from "../services/factories/user-irrigation";
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

  static async create(request: SaveIrrigationCropsRequest): Promise<HttpResponse> {
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

      const successOrError = await userIrrigationService.saveIrrigationCrops({
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

  static async updateIrrigationCropsById(
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

      const successOrError = await userIrrigationService.updateIrrigationCropsById({
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

  static async deleteIrrigationCrops(
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

      const successOrError = await userIrrigationService.deleteIrrigationCropsById(
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

  static async getIrrigationCropsById(
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

      const successOrError = await userIrrigationService.getIrrigationCropsById(
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

  static async getAllIrrigationCrops(
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

      const successOrError = await userIrrigationService.getAllIrrigationCrops(
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
