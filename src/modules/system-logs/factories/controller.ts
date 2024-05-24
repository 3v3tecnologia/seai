import { Controller } from "../../../shared/presentation/controllers";
import { FetchEquipmentLogsController } from "../controllers/fetch-equipents-measurements-logs";
import { SystemLogsUseCaseFactory } from "./services";


export class SystemLogsControllersFactory {
    static makeFetchEquipmentMeasuresLogs(): Controller {
        return new FetchEquipmentLogsController(
            SystemLogsUseCaseFactory.makeFetchEquipmentMeasuresLogs()
        );
    }
}
