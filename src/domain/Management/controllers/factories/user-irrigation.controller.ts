import { ManagementCropRepository } from "../../repositories/crop.repository";
import { IrrigationCropsRepository } from "../../repositories/irrigation.repository";
import { UserIrrigationCropsServices } from "../../services/user-irrigation.service";
import { UserIrrigationControllers } from "../user-irrigation.controller";

export const makeUserIrrigationControllers = () => {
  return new UserIrrigationControllers(
    new UserIrrigationCropsServices(new IrrigationCropsRepository(), new ManagementCropRepository())
  );
};
