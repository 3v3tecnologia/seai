import { ManagementCropRepository } from "../../../Crop/repositories/crop.repository";
import { EquipmentsMeasurementsRepository } from "../../../Equipments/repositories/equipments-measurements.repository";
import { IrrigationCropsRepository } from "../../repositories/irrigation.repository";
import { IrrigationCropsSuggestion } from "../irrigation-suggestion.service";

export const irrigationRecommendation = new IrrigationCropsSuggestion(
    new EquipmentsMeasurementsRepository(),
    new ManagementCropRepository(),
    new IrrigationCropsRepository()
)