import {
  FetchLatestEquipmentMeasurementsController,
  FetchPluviometersReadsController,
  FetchStationsReadsController,
  UpdateEt0Controller,
} from "../presentation/controllers";
import { UpdatePluviometerController } from "../presentation/controllers/update-pluviometer-measures.controller";
import { UpdateStationMeasuresController } from "../presentation/controllers/update-station-measures.controller";
import { Controller } from "../../../shared/presentation/controllers";
import {
  EquipmentsMeasurementsUseCasesFactory,
  SystemLogsUseCaseFactory,
} from "../../../server/http/factories/use-cases";

export class EquipmentsMeasurementsControllerFactory {
  static makeUpdateStationMeasurements(): Controller {
    return new UpdateStationMeasuresController(
      EquipmentsMeasurementsUseCasesFactory.makeUpdateStationMeasurements(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }
  static makeUpdatePluviometerMeasures(): Controller {
    return new UpdatePluviometerController(
      EquipmentsMeasurementsUseCasesFactory.makeUpdatePluviometerMeasures(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }
  static makeFetchStationsReads(): Controller {
    return new FetchStationsReadsController(
      EquipmentsMeasurementsUseCasesFactory.makeFetchStationsMeasurements()
    );
  }
  static makeFetchLatestEquipmentMeasurementsController(): Controller {
    return new FetchLatestEquipmentMeasurementsController(
      EquipmentsMeasurementsUseCasesFactory.makeFetchLatestEquipmentMeasurements()
    );
  }
  static makeFetchPluviometersReads(): Controller {
    return new FetchPluviometersReadsController(
      EquipmentsMeasurementsUseCasesFactory.makeFetchPluviometersMeasurements()
    );
  }
  static makeUpdateEt0(): Controller {
    return new UpdateEt0Controller(
      EquipmentsMeasurementsUseCasesFactory.makeUpdateEt0(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }
}
