import {
  FetchLatestEquipmentMeasurementsController,
  FetchPluviometersReadsController,
  FetchStationsReadsController,
} from "../../../../presentation/controllers/equipments";
import {
  updatePluviometerMeasurements,
  updateStationMeasurements,
} from "../../../../presentation/controllers/equipments/schemas/measurements";
import { UpdatePluviometerController } from "../../../../presentation/controllers/equipments/update-pluviometer-measures.controller";
import { UpdateStationMeasuresController } from "../../../../presentation/controllers/equipments/update-station-measures.controller";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { EquipmentsMeasurementsUseCasesFactory } from "../use-cases";

export class EquipmentsMeasurementsControllerFactory {
  static makeUpdateStationMeasurements(): Controller {
    return new UpdateStationMeasuresController(
      EquipmentsMeasurementsUseCasesFactory.makeUpdateStationMeasurements(),
      updateStationMeasurements
    );
  }
  static makeUpdatePluviometerMeasures(): Controller {
    return new UpdatePluviometerController(
      EquipmentsMeasurementsUseCasesFactory.makeUpdatePluviometerMeasures(),
      updatePluviometerMeasurements
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
}
