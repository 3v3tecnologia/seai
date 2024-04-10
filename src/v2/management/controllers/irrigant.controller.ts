import {
  badRequest,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { IrrigationRecommendationUseCases } from "../services/irrigant";

export class IrrigantControllers {
  static async getBladeIrrigation(command: {
    station_id: number;
    pluviometer_id: number;
    crop_id: number;
    planting_date: string;
    irrigation_efficiency: number;
    application_rate: number;
  }): Promise<HttpResponse> {
    try {
      const successOrError =
        await IrrigationRecommendationUseCases.calcBladeIrrigationRecommendation(
          command
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
