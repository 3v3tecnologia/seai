import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { FetchEquipmentLogsController } from "../../../../../presentation/controllers/system-logs/fetch-equipment-measures-logs.controller";
import { makeFetchEquipmentMeasuresLogs } from "../../use-cases/system-logs";

export const makeFetchEquipmentMeasuresLogsController = (): Controller => {
  return new FetchEquipmentLogsController(makeFetchEquipmentMeasuresLogs());
};
