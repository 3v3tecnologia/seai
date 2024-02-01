import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { FetchEquipmentLogsController } from "../../../../presentation/controllers/system-logs/fetch-equipment-measures-logs.controller";
import { SystemLogsUseCaseFactory } from "../use-cases";

export class SystemLogsControllersFactory {
  static makeFetchEquipmentMeasuresLogs(): Controller {
    return new FetchEquipmentLogsController(
      SystemLogsUseCaseFactory.makeFetchEquipmentMeasuresLogs()
    );
  }
}
