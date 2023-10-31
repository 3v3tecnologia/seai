import { UpdateEquipmentsController } from "../../../../../presentation/controllers/equipments-controller/update-equipment.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeUpdateEquipment } from "../../use-cases/equipments";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeUpdateEquipmentController = (): Controller => {
  return new UpdateEquipmentsController(
    makeUpdateEquipment(),
    makeRegisterUserLogs()
  );
};
