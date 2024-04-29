import {
  CreateEquipmentsController,
  CreateMeteorologicalOrganController,
  DeleteEquipmentController,
  DeleteMeteorologicalOrganController,
  FetchEquipmentsController,
  FetchEquipmentsWithYesterdayMeasurementsController,
  FetchMeteorologicalOrganController,
  UpdateEquipmentsController,
  UpdateMeteorologicalOrganController,
} from "../../../../presentation/controllers/equipments";
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

  static makeFetchEquipmentsWithYesterdayMeasurementsController(): Controller {
    return new FetchEquipmentsWithYesterdayMeasurementsController(
      EquipmentsUseCasesFactory.makeFetchEquipmentsWithYesterdayMeasurements()
    );
  }
  // static makeFetchPluviometersWithYesterdayMeasurementsController(): Controller {
  //   return new FetchPluviometersWithYesterdayMeasurementsController(
  //     EquipmentsUseCasesFactory.makeFetchPluviometersWithYesterdayMeasurements()
  //   );
  // }
}
