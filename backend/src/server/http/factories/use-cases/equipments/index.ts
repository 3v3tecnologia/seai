import { CreateEquipments } from "../../../../../domain/use-cases/equipments/create-equipment";
import { CreateMeteorologicalOrgan } from "../../../../../domain/use-cases/equipments/create-meteorological-organ";
import { DeleteEquipment } from "../../../../../domain/use-cases/equipments/delete-equipment";
import { DeleteMeteorologicalOrgan } from "../../../../../domain/use-cases/equipments/delete-meteorological-organ";
import { FetchEquipments } from "../../../../../domain/use-cases/equipments/fetch-equipments";
import { FetchMeteorologicalOrgans } from "../../../../../domain/use-cases/equipments/fetch-meteorologial-organs";
import { FetchPluviometerReadsByIdRead } from "../../../../../domain/use-cases/equipments/fetch-pluviometer-reads-by-id-read";
import { FetchPluviometersReads } from "../../../../../domain/use-cases/equipments/fetch-pluviometers-reads";
import { FetchStationReadsByIdRead } from "../../../../../domain/use-cases/equipments/fetch-station-reads-by-id-read";
import { FetchStationsReads } from "../../../../../domain/use-cases/equipments/fetch-stations-reads";
import { UpdateEquipment } from "../../../../../domain/use-cases/equipments/update-equipment";
import { UpdateMeteorologicalOrgan } from "../../../../../domain/use-cases/equipments/update-meteorological-organ";
import { UpdatePluviometerMeasures } from "../../../../../domain/use-cases/equipments/update-pluviometer-measures";
import { UpdateStationMeasures } from "../../../../../domain/use-cases/equipments/update-station-measures";
import { DbEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

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
}
