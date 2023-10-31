import { DeleteEquipmentController } from "../../../../../presentation/controllers/equipments-controller/delete-equipment.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeDeleteEquipment } from "../../use-cases/equipments";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeDeleteEquipmentController = (): Controller => {
  return new DeleteEquipmentController(
    makeDeleteEquipment(),
    makeRegisterUserLogs()
  );
};
