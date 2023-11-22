import { UpdatePluviometerController } from "../../../../../presentation/controllers/equipments-controller/update-pluviometer-measures.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeUpdatePluviometerMeasures } from "../../use-cases/equipments/update-pluviometer-measures";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeUpdatePluviometerMeasuresController = (): Controller => {
  return new UpdatePluviometerController(
    makeUpdatePluviometerMeasures(),
    makeRegisterUserLogs()
  );
};
