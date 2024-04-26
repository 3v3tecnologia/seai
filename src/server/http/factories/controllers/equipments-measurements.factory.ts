import {
  FetchLatestEquipmentMeasurementsController,
  FetchPluviometersReadsController,
  FetchStationsReadsController,
  UpdateEt0Controller,
} from "../../../../presentation/controllers/equipments";
import { UpdatePluviometerController } from "../../../../presentation/controllers/equipments/update-pluviometer-measures.controller";
import { UpdateStationMeasuresController } from "../../../../presentation/controllers/equipments/update-station-measures.controller";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import {
  EquipmentsMeasurementsUseCasesFactory,
  SystemLogsUseCaseFactory,
} from "../use-cases";

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
