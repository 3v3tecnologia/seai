import { UpdateMeteorologicalOrganController } from "../../../../../presentation/controllers/equipments-controller/update-meteorological-organ.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";
import { makeUpdateMeteorologicalOrgan } from "./../../use-cases/equipments/update-meteorological-organ";

export const makeUpdateEquipmentsController = (): Controller => {
  return new UpdateMeteorologicalOrganController(
    makeUpdateMeteorologicalOrgan(),
    makeRegisterUserLogs()
  );
};
