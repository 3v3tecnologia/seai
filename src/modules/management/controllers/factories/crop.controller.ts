import { ManagementCropRepository } from "../../repositories/crop.repository";
import { ManagementCropsServices } from "../../services/crop.service";
import { ManagementCropControllers } from "../crop.controller";

export const makeManagementCropControllers = () => {
  return new ManagementCropControllers(
    new ManagementCropsServices(new ManagementCropRepository())
  );
};
