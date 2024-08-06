import { EquipmentsMeasurementsRepository } from "../../repositories/equipments-measurements.repository";
import { EquipmentsRepository } from "../../repositories/equipments.repository";
import { EquipmentsMeasurementsServices } from "../../services/measurements.service";
import { EquipmentsMeasurementsControllers } from "../measurements.controller";

export const makeEquipmentsMeasurementsControllers = () => {
  return new EquipmentsMeasurementsControllers(
    new EquipmentsMeasurementsServices(
      new EquipmentsRepository(),
      new EquipmentsMeasurementsRepository()
    )
  );
};
