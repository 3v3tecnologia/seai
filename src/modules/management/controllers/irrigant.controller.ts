

import { badRequest, created, ok, serverError } from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { IrrigationSystemMeasurementsTypes, IrrigationSystemTypes } from "../core/model/irrigation-system";
import { CalcIrrigationRecommendationDTO } from "../services/dto/irrigant";
import { IrrigationRecommendationServices } from "../services/irrigant";
import { bladeSuggestionValidator } from "./schema/blade-suggestion";

export class IrrigantControllers {
  static async getBladeIrrigation(
    request: CalcIrrigationRecommendationDTO.Input
  ): Promise<HttpResponse> {
    try {
      const {
        CropId,
        IrrigationEfficiency,
        PlantingDate,
        Pluviometer,
        Station,
        System
      } = request

      const { error } = await bladeSuggestionValidator.validate({
        CropId,
        IrrigationEfficiency,
        PlantingDate,
        Pluviometer,
        Station,
        System
      });

      if (error) {
        return badRequest(error)
      }

      const successOrError =
        await IrrigationRecommendationServices.calcBladeIrrigationRecommendation(
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

  static async saveUserEquipments(request: {
    StationId: number;
    PluviometerId: number;
  } & { accountId: number }): Promise<HttpResponse> {
    try {
      const successOrError = await IrrigationRecommendationServices.saveUserEquipments({
        UserId: request.accountId,
        PluviometerId: request.PluviometerId,
        StationId: request.StationId
      })

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return created(successOrError.value);
    } catch (error) {
      return badRequest(error as Error)
    }
  }

  static async deleteUserEquipments(request: { id: number }): Promise<HttpResponse> {
    try {
      const successOrError = await IrrigationRecommendationServices.deleteUserEquipments(request.id)

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return ok(successOrError.value);
    } catch (error) {
      return badRequest(error as Error)
    }
  }

  static async updateUserEquipments(request: {
    StationId: number;
    PluviometerId: number;
  } & { accountId: number }): Promise<HttpResponse> {
    try {
      const successOrError = await IrrigationRecommendationServices.updateUserEquipments({
        UserId: request.accountId,
        StationId: request.StationId,
        PluviometerId: request.PluviometerId
      })

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return created(successOrError.value);
    } catch (error) {
      return badRequest(error as Error)
    }
  }

  static async getUserEquipments(request: { accountId: number }): Promise<HttpResponse> {
    try {
      const successOrError = await IrrigationRecommendationServices.getUserEquipments(request.accountId)

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return ok(successOrError.value);
    } catch (error) {
      return badRequest(error as Error)
    }
  }

  static async saveRecommendation(request: {
    CropId: number;
    PlantingDate: string;
    IrrigationEfficiency: number;
    System: {
      Type: IrrigationSystemTypes;
      Measurements: IrrigationSystemMeasurementsTypes;
    }
  } & { accountId: number }): Promise<HttpResponse> {
    try {
      const successOrError = await IrrigationRecommendationServices.saveIrrigationCrops({
        CropId: request.CropId,
        IrrigationEfficiency: request.IrrigationEfficiency,
        PlantingDate: request.PlantingDate,
        System: request.System,
        UserId: request.accountId
      })

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return ok(successOrError.value);
    } catch (error) {
      return badRequest(error as Error)
    }
  }

  static async deleteRecommendation(request: { id: number }): Promise<HttpResponse> {
    try {
      const successOrError = await IrrigationRecommendationServices.deleteIrrigationCrops(request.id)

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return ok(successOrError.value);
    } catch (error) {
      return badRequest(error as Error)
    }
  }

  static async getRecommendationById(request: { id: number, accountId: number }): Promise<HttpResponse> {
    try {
      const successOrError = await IrrigationRecommendationServices.getIrrigationCropsById(request.id, request.accountId)

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return ok(successOrError.value);
    } catch (error) {
      return badRequest(error as Error)
    }
  }

  static async getAllRecommendationByUserId(request: { accountId: number }): Promise<HttpResponse> {
    try {
      const successOrError = await IrrigationRecommendationServices.getAllIrrigationCropsByUserId(request.accountId)

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return ok(successOrError.value);
    } catch (error) {
      return badRequest(error as Error)
    }
  }
}
