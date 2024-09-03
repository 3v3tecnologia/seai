import { EquipmentsMeasurementsRepository } from "../repositories/equipments-measurements.repository";
import { EquipmentsRepository } from "../repositories/equipments.repository";
import { EquipmentsServices } from "./equipments.service";
import { EquipmentsMeasurementsServices } from "./measurements.service";

const eqpRepository = new EquipmentsRepository();

export const equipmentsService = new EquipmentsServices(eqpRepository);
export const equipmentsMeasurementsService = new EquipmentsMeasurementsServices(
  eqpRepository,
  new EquipmentsMeasurementsRepository()
);