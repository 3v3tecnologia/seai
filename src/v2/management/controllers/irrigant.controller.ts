import {
  badRequest,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { ICalcBaldeIrrigationRecommendationService, IrrigationRecommendationUseCases } from "../services/irrigant";


export class IrrigantControllers {
  static async getBladeIrrigation(command: ICalcBaldeIrrigationRecommendationService.Input): Promise<HttpResponse> {
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
