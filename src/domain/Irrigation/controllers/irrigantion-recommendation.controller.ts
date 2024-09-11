import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";
import { IIrrigationSuggestionServices } from "../services/protocols/irrigation-suggestion";
import {
  CalcIrrigationRecommendationByIdRequest,
  calcIrrigationRecommendationRequest,
} from "./dto/irrigation-recommendation";
import { bladeSuggestionValidator } from "./schema/blade-suggestion";
import { calculateUserIrrigationRecommendationByIdValidator } from "./schema/user-irrigation";

export class IrrigationRecommendationControllers {
  constructor(private services: IIrrigationSuggestionServices) {}

  async calcIrrigationRecommendation(
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

      const successOrError = await this.services.calculate(request);

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      //   await this.userLogs.log(request.accountId, this.useCase);

      return ok(successOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  async calcIrrigationRecommendationById(
    request: CalcIrrigationRecommendationByIdRequest
  ): Promise<HttpResponse> {
    try {
      const { id, accountId } = request;

      const { error } =
        await calculateUserIrrigationRecommendationByIdValidator.validate({
          id,
          accountId,
        });

      if (error) {
        return badRequest(error);
      }
      const successOrError = await this.services.calcByIrrigationId(
        request.id,
        request.accountId
      );

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return ok(successOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  // static async calcUsersRecommendations(): Promise<HttpResponse> {
  //   try {
  //     const dataSource = UserRecommendationsServices.calcUsersRecommendations();

  //     if (successOrError.isLeft()) {
  //       return badRequest(successOrError.value);
  //     }

  //     return ok(successOrError.value);
  //   } catch (error) {
  //     console.log(error);
  //     return badRequest(error as Error);
  //   }
  // }
}
