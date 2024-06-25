import {
  badRequest,
  created,
  noContent,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { UserRecommendationsServices } from "../services/user-irrigation";
import {
  CalcIrrigationRecommendationByIdRequest,
  DeleteIrrigationCropsRequest,
  GetAllIrrigationCropsRequest,
  GetIrrigationCropsByIdRequest,
  SaveIrrigationCropsRequest,
  UpdateIrrigationCropsRequest,
  calcIrrigationRecommendationRequest,
} from "./dto/irrigation-recommendation";
import { bladeSuggestionValidator } from "./schema/blade-suggestion";

export class IrrigationRecommendationControllers {
  static async calcIrrigationRecommendation(
    request: calcIrrigationRecommendationRequest
  ): Promise<HttpResponse> {
    try {
      const {
        CropId,
        IrrigationEfficiency,
        PlantingDate,
        Pluviometer,
        Station,
        System,
      } = request;

      const { error } = await bladeSuggestionValidator.validate({
        CropId,
        IrrigationEfficiency,
        PlantingDate,
        Pluviometer,
        Station,
        System,
      });

      if (error) {
        return badRequest(error);
      }

      const successOrError =
        await UserRecommendationsServices.calcBladeIrrigationRecommendation(
          request
        );

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      //   await this.userLogs.log(request.accountId, this.useCase);

      return ok(successOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async saveIrrigationCrops(
    request: SaveIrrigationCropsRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError =
        await UserRecommendationsServices.saveIrrigationCrops({
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

  static async updateIrrigationCropsById(
    request: UpdateIrrigationCropsRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError =
        await UserRecommendationsServices.updateIrrigationCropsById({
          Id: request.id,
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

  static async deleteIrrigationCrops(
    request: DeleteIrrigationCropsRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError =
        await UserRecommendationsServices.deleteIrrigationCropsById(
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

  static async getIrrigationCropsById(
    request: GetIrrigationCropsByIdRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError =
        await UserRecommendationsServices.getIrrigationCropsById(
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

  static async calcIrrigationRecommendationById(
    request: CalcIrrigationRecommendationByIdRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError =
        await UserRecommendationsServices.calcIrrigationRecommendationById(
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

  static async getAllIrrigationCrops(
    request: GetAllIrrigationCropsRequest
  ): Promise<HttpResponse> {
    try {
      const successOrError =
        await UserRecommendationsServices.getAllIrrigationCrops(
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

  static async calcUsersRecommendations(): Promise<HttpResponse> {
    try {
      const successOrError =
        await UserRecommendationsServices.calcUsersRecommendations();

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return ok(successOrError.value);
    } catch (error) {
      console.log(error);
      return badRequest(error as Error);
    }
  }
}
