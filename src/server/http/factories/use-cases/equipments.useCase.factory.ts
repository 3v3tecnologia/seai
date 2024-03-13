import {
  CreateEquipments,
  CreateMeteorologicalOrgan,
  DeleteEquipment,
  DeleteMeteorologicalOrgan,
  FetchEquipments,
  FetchMeteorologicalOrgans,
  FetchPluviometerReadsByIdRead,
  FetchPluviometersReads,
  FetchStationReadsByIdRead,
  FetchStationsReads,
  UpdateEquipment,
  UpdateMeteorologicalOrgan,
  UpdatePluviometerMeasures,
  UpdateStationMeasures,
} from "../../../../domain/use-cases/equipments";
import { FetchPluviometersReadsWithLastMeasurements } from "../../../../domain/use-cases/equipments/fetch-pluviometers-with-last-measurements";
import { FetchStationReadsWithLastMeasurements } from "../../../../domain/use-cases/equipments/fetch-stations-with-last-measurements";
import { DbEquipmentsRepository } from "../../../../infra/database/postgres/repositories/equipments-repository";

export class EquipmentsUseCasesFactory {
  private static repository = new DbEquipmentsRepository();

  static makeCreateEquipment(): CreateEquipments {
    const repository = new DbEquipmentsRepository();
    return new CreateEquipments(this.repository);
  }

  static makeUpdateEquipment(): UpdateEquipment {
    return new UpdateEquipment(this.repository);
  }

  static makeCreateMeteorologicalOrgan(): CreateMeteorologicalOrgan {
    return new CreateMeteorologicalOrgan(this.repository);
  }

  static makeDeleteEquipment(): DeleteEquipment {
    return new DeleteEquipment(this.repository);
  }

  static makeDeleteMeteorologicalOrgan(): DeleteMeteorologicalOrgan {
    const repository = new DbEquipmentsRepository();
    return new DeleteMeteorologicalOrgan(this.repository);
  }

  static makeFetchEquipments(): FetchEquipments {
    return new FetchEquipments(this.repository);
  }

  static makeFetchMeteorologicalOrgan(): FetchMeteorologicalOrgans {
    return new FetchMeteorologicalOrgans(this.repository);
  }

  static makeFetchPluviometerReadsByIdRead(): FetchPluviometerReadsByIdRead {
    return new FetchPluviometerReadsByIdRead(this.repository);
  }

  static makeFetchPluviometersReads(): FetchPluviometersReads {
    return new FetchPluviometersReads(this.repository);
  }

  static makeFetchStationReadsByIdRead(): FetchStationReadsByIdRead {
    return new FetchStationReadsByIdRead(this.repository);
  }

  static makeFetchStationsReads(): FetchStationsReads {
    return new FetchStationsReads(this.repository);
  }

  static makeUpdateMeteorologicalOrgan(): UpdateMeteorologicalOrgan {
    return new UpdateMeteorologicalOrgan(this.repository);
  }

  static makeUpdatePluviometerMeasures(): UpdatePluviometerMeasures {
    return new UpdatePluviometerMeasures(this.repository);
  }

  static makeUpdateStationMeasures(): UpdateStationMeasures {
    return new UpdateStationMeasures(this.repository);
  }
  static makeFetchStationsWithLastMeasurements(): FetchStationReadsWithLastMeasurements {
    return new FetchStationReadsWithLastMeasurements(this.repository);
  }
  static makeFetchPluviometersWithLastMeasurements(): FetchPluviometersReadsWithLastMeasurements {
    return new FetchPluviometersReadsWithLastMeasurements(this.repository);
  }
}
