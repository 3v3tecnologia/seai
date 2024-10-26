import { Either } from "../../../../shared/Either";
import { IrrigationRecommendationReports } from "../../core/model/irrigation-reports";
import { UserIrrigationPreferences } from "../dto/irrigation-recommendation";

export interface IIrrigationSuggestionServices {
  calculate(
    command: UserIrrigationPreferences
  ): Promise<Either<Error, any | null>>;
  calcByIrrigationId(id: number, user_id: number): Promise<Either<Error, any>>;
  calPerUsers(): AsyncGenerator<
    IrrigationRecommendationReports,
    null | undefined,
    unknown
  >;
}
