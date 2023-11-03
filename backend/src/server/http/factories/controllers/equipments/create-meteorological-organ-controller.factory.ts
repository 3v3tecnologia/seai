import { CreateMeteorologicalOrganController } from "../../../../../presentation/controllers/equipments-controller/create-meteorological-organ.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeCreateMeteorologicalOrgan } from "../../use-cases/equipments/create-meteorological-organ";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeCreateMeteorologicalOrganController = (): Controller => {
  return new CreateMeteorologicalOrganController(
    makeCreateMeteorologicalOrgan(),
    makeRegisterUserLogs()
  );
};
