import { CreateEquipmentsController } from "../../../../../presentation/controllers/equipments-controller/create-equipment.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeCreateEquipment } from "../../use-cases/equipments/create-equipments";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeCreateEquipmentsController = (): Controller => {
  return new CreateEquipmentsController(
    makeCreateEquipment(),
    makeRegisterUserLogs()
  );
};
