import { ManagementCropRepository } from "../repositories/crop.repository";
import { ManagementCropsServices } from "./crop.service";

export const managementCropsServices = new ManagementCropsServices(new ManagementCropRepository())
