import { ManagementCropRepository } from "../../repositories/crop.repository";
import { IrrigationCropsRepository } from "../../repositories/irrigation.repository";
import { IrrigationCropsSuggestion } from "../../services/irrigation-suggestion.service";
import { IrrigationRecommendationControllers } from "../irrigantion-recommendation.controller";

export const makeIrrigationRecommendationControllers = () => {
  return new IrrigationRecommendationControllers(
    new IrrigationCropsSuggestion(
      new IrrigationCropsRepository(),
      new ManagementCropRepository(),
      new IrrigationCropsRepository()
    )
  );
};
