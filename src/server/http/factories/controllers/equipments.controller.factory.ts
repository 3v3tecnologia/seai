import {
  CreateEquipmentsController,
  CreateMeteorologicalOrganController,
  DeleteEquipmentController,
  DeleteMeteorologicalOrganController,
  FetchEquipmentsController,
  FetchMeteorologicalOrganController,
  FetchPluviometerReadsByIdReadController,
  FetchPluviometersReadsController,
  FetchStationReadsByIdReadController,
  FetchStationsReadsController,
  UpdateEquipmentsController,
  UpdateMeteorologicalOrganController,
} from "../../../../presentation/controllers/equipments";
import { UpdatePluviometerController } from "../../../../presentation/controllers/equipments/update-pluviometer-measures.controller";
import { UpdateStationMeasuresController } from "../../../../presentation/controllers/equipments/update-station-measures.controller";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import {
  EquipmentsUseCasesFactory,
  SystemLogsUseCaseFactory,
} from "../use-cases";

export class EquipmentsControllerFactory {
  static makeCreateEquipments(): Controller {
    return new CreateEquipmentsController(
      EquipmentsUseCasesFactory.makeCreateEquipment(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }
  static makeCreateMeteorologicalOrgan(): Controller {
    return new CreateMeteorologicalOrganController(
      EquipmentsUseCasesFactory.makeCreateMeteorologicalOrgan(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }
  static makeDeleteEquipment(): Controller {
    return new DeleteEquipmentController(
      EquipmentsUseCasesFactory.makeDeleteEquipment(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }
  static makeDeleteMeteorologicalOrgan(): Controller {
    return new DeleteMeteorologicalOrganController(
      EquipmentsUseCasesFactory.makeDeleteMeteorologicalOrgan(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }
  static makeFetchEquipments(): Controller {
    return new FetchEquipmentsController(
      EquipmentsUseCasesFactory.makeFetchEquipments()
    );
  }

  static makeFetchMeteorologicalOrgan(): Controller {
    return new FetchMeteorologicalOrganController(
      EquipmentsUseCasesFactory.makeFetchMeteorologicalOrgan()
    );
  }
  static makeFetchPluviometerReadsByIdRead(): Controller {
    return new FetchPluviometerReadsByIdReadController(
      EquipmentsUseCasesFactory.makeFetchPluviometerReadsByIdRead()
    );
  }
  static makeFetchPluviometersReads(): Controller {
    return new FetchPluviometersReadsController(
      EquipmentsUseCasesFactory.makeFetchPluviometersReads()
    );
  }
  static makeFetchStationReadsByIdRead(): Controller {
    return new FetchStationReadsByIdReadController(
      EquipmentsUseCasesFactory.makeFetchStationReadsByIdRead()
    );
  }
  static makeFetchStationsReads(): Controller {
    return new FetchStationsReadsController(
      EquipmentsUseCasesFactory.makeFetchStationsReads()
    );
  }

  static makeUpdateEquipment(): Controller {
    return new UpdateEquipmentsController(
      EquipmentsUseCasesFactory.makeUpdateEquipment(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }
  static makeUpdateMeteorologicalOrgan(): Controller {
    return new UpdateMeteorologicalOrganController(
      EquipmentsUseCasesFactory.makeUpdateMeteorologicalOrgan(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }
  static makeUpdatePluviometerMeasures(): Controller {
    return new UpdatePluviometerController(
      EquipmentsUseCasesFactory.makeUpdatePluviometerMeasures(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }
  static makeUpdateStationMeasures(): Controller {
    return new UpdateStationMeasuresController(
      EquipmentsUseCasesFactory.makeUpdateStationMeasures(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }
}
