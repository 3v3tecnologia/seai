import {
  CreateEquipments,
  CreateMeteorologicalOrgan,
  DeleteEquipment,
  DeleteMeteorologicalOrgan,
  FetchEquipments,
  FetchMeteorologicalOrgans,
  FetchLatestEquipmentMeasurements,
  FetchPluviometersReads,
  FetchEquipmentsWithYesterdayMeasurements,
  FetchStationsReads,
  UpdateEquipment,
  UpdateMeteorologicalOrgan,
  UpdatePluviometerMeasures,
  UpdateStationMeasures,
} from "../../../../domain/use-cases/equipments";

import { DbEquipmentsRepository } from "../../../../infra/database/postgres/repositories/equipments-repository";

export class EquipmentsUseCasesFactory {
  private static repository = new DbEquipmentsRepository();

  static makeCreateEquipment(): CreateEquipments {
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
    return new DeleteMeteorologicalOrgan(this.repository);
  }

  static makeFetchEquipments(): FetchEquipments {
    return new FetchEquipments(this.repository);
  }

  static makeFetchMeteorologicalOrgan(): FetchMeteorologicalOrgans {
    return new FetchMeteorologicalOrgans(this.repository);
  }

  static makeFetchPluviometersReads(): FetchPluviometersReads {
    return new FetchPluviometersReads(this.repository);
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
  static makeFetchEquipmentsWithYesterdayMeasurements(): FetchEquipmentsWithYesterdayMeasurements {
    return new FetchEquipmentsWithYesterdayMeasurements(this.repository);
  }

  static makeFetchLatestEquipmentMeasurements(): FetchLatestEquipmentMeasurements {
    return new FetchLatestEquipmentMeasurements(this.repository);
  }
}
