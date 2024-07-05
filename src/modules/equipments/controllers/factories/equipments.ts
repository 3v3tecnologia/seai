import { EquipmentsRepository } from "../../repositories/equipments.repository";
import { EquipmentsServices } from "../../services/equipments.service";
import { EquipmentsControllers } from "../equipments.controller";

export const makeEquipmentsControllers = () => {
  return new EquipmentsControllers(
    new EquipmentsServices(new EquipmentsRepository())
  );
};
