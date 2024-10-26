import { ManagementCropRepository } from "../../../Crop/infra/repository/crop.repository";
import { EquipmentsMeasurementsRepository } from "../../../Equipments/infra/repository/equipments-measurements.repository";
import { UserIrrigationPreferencesRepository } from "../../infra/repository/irrigation.repository";
import { IrrigationCropsSuggestion } from "../irrigation-suggestion.service";

export const irrigationRecommendation = new IrrigationCropsSuggestion(
  new EquipmentsMeasurementsRepository(),
  new ManagementCropRepository(),
  new UserIrrigationPreferencesRepository()
)
