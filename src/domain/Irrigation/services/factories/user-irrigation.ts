import { ManagementCropRepository } from "../../../Crop/repositories/crop.repository";
import { IrrigationCropsRepository } from "../../repositories/irrigation.repository";
import { UserIrrigationCropsServices } from "../user-irrigation.service";

export const userIrrigationService = new UserIrrigationCropsServices(new IrrigationCropsRepository(), new ManagementCropRepository())