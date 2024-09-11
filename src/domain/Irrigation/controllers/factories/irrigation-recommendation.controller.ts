import { ManagementCropRepository } from "../../../Crop/repositories/crop.repository";
import { EquipmentsMeasurementsRepository } from "../../../Equipments/repositories/equipments-measurements.repository";
import { IrrigationCropsRepository } from "../../repositories/irrigation.repository";
import { IrrigationCropsSuggestion } from "../../services/irrigation-suggestion.service";
import { IrrigationRecommendationControllers } from "../irrigantion-recommendation.controller";

export const makeIrrigationRecommendationControllers = () => {
  return new IrrigationRecommendationControllers(
    new IrrigationCropsSuggestion(
      new EquipmentsMeasurementsRepository(),
      new ManagementCropRepository(),
      new IrrigationCropsRepository()
    )
  );
};
