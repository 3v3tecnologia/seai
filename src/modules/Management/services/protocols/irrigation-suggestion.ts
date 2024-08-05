import { Either } from "../../../../shared/Either";
import { UserIrrigationRecommendation } from "../../core/model/user-irrigation-recommendation";
import { ICalcIrrigationRecommendationDTO } from "../dto/irrigation";

export interface IIrrigationSuggestionServices {
  calculate(
    command: ICalcIrrigationRecommendationDTO
  ): Promise<Either<Error, any | null>>;
  calcByIrrigationId(id: number, user_id: number): Promise<Either<Error, any>>;
  calPerUsers(): AsyncGenerator<
    UserIrrigationRecommendation,
    null | undefined,
    unknown
  >;
}
