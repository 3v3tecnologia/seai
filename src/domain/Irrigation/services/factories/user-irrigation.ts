import { ManagementCropRepository } from "../../../Crop/infra/repository/crop.repository";
import { UserIrrigationPreferencesRepository } from "../../infra/repository/irrigation.repository";
import { UserIrrigationPreferencesServices } from "../user-irrigation-preferences.service";

export const userIrrigationService = new UserIrrigationPreferencesServices(new UserIrrigationPreferencesRepository(), new ManagementCropRepository())
