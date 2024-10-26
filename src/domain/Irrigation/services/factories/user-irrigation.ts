import { ManagementCropRepository } from "../../../Crop/repositories/crop.repository";
import { UserIrrigationPreferencesRepository } from "../../repositories/irrigation.repository";
import { UserIrrigationPreferencesServices } from "../user-irrigation-preferences.service";

export const userIrrigationService = new UserIrrigationPreferencesServices(new UserIrrigationPreferencesRepository(), new ManagementCropRepository())
