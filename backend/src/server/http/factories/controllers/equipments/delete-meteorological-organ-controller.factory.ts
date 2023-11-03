import { DeleteMeteorologicalOrganController } from "../../../../../presentation/controllers/equipments-controller/delete-meteorological-organ.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeCreateMeteorologicalOrgan } from "../../use-cases/equipments/create-meteorological-organ";
import { makeDeleteMeteorologicalOrgan } from "../../use-cases/equipments/delete-meteorological-organ";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeDeleteEquipmentsController = (): Controller => {
  return new DeleteMeteorologicalOrganController(
    makeDeleteMeteorologicalOrgan(),
    makeRegisterUserLogs()
  );
};
