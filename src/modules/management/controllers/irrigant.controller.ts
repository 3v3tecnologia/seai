

import { badRequest, serverError, ok } from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { ICalcBaldeIrrigationRecommendationService, IrrigationRecommendationServices } from "../services/irrigant";
import { bladeSuggestionValidator } from "./schema/blade-suggestion";

export class IrrigantControllers {
  static async getBladeIrrigation(
    request: ICalcBaldeIrrigationRecommendationService.Input
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
      console.error(error);
      return serverError(error as Error);
    }
  }
}
