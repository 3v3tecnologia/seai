import {
  FetchLatestEquipmentMeasurements,
  FetchPluviometersReads,
  FetchStationsReads,
  UpdatePluviometerMeasures,
  UpdateStationMeasurements,
} from "../../../../domain/use-cases/equipments";
import { UpdateEt0 } from "../../../../domain/use-cases/equipments/update-et0";
import { EquipmentsMeasurementsRepository } from "../../../../infra/database/postgres/repositories/equipments-measurements.repository";
import { EquipmentsUseCasesFactory } from "./equipments.factory";

export class EquipmentsMeasurementsUseCasesFactory {
  static repository = new EquipmentsMeasurementsRepository();

  static makeUpdateStationMeasurements(): UpdateStationMeasurements {
    return new UpdateStationMeasurements(
      this.repository,
      EquipmentsUseCasesFactory.repository
    );
  }
  static makeFetchLatestEquipmentMeasurements(): FetchLatestEquipmentMeasurements {
    return new FetchLatestEquipmentMeasurements(this.repository);
  }
  static makeUpdatePluviometerMeasures(): UpdatePluviometerMeasures {
    return new UpdatePluviometerMeasures(this.repository);
  }
  static makeFetchStationsMeasurements(): FetchStationsReads {
    return new FetchStationsReads(this.repository);
  }
  static makeFetchPluviometersMeasurements(): FetchPluviometersReads {
    return new FetchPluviometersReads(this.repository);
  }
  static makeUpdateEt0(): UpdateEt0 {
    return new UpdateEt0(this.repository);
  }
}
