import { ManagementCropRepository } from "../../../Crop/infra/repository/crop.repository";
import { IrrigationCropsRepository } from "../../infra/repository/irrigation.repository";
import { UserIrrigationCropsServices } from "../user-irrigation.service";

export const userIrrigationService = new UserIrrigationCropsServices(new IrrigationCropsRepository(), new ManagementCropRepository())
