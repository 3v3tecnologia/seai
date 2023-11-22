import { UpdateStationMeasuresController } from "../../../../../presentation/controllers/equipments-controller/update-station-measures.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeUpdateStationMeasures } from "../../use-cases/equipments/update-station-measures";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeUpdateStationMeasuresController = (): Controller => {
  return new UpdateStationMeasuresController(
    makeUpdateStationMeasures(),
    makeRegisterUserLogs()
  );
};
