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
import { EquipmentsUseCasesFactory } from "../use-cases";

export class EquipmentsControllerFactory {
  static makeCreateEquipments(): Controller {
    return new CreateEquipmentsController(
      EquipmentsUseCasesFactory.makeCreateEquipment()
    );
  }
  static makeCreateMeteorologicalOrgan(): Controller {
    return new CreateMeteorologicalOrganController(
      EquipmentsUseCasesFactory.makeCreateMeteorologicalOrgan()
    );
  }
  static makeDeleteEquipment(): Controller {
    return new DeleteEquipmentController(
      EquipmentsUseCasesFactory.makeDeleteEquipment()
    );
  }
  static makeDeleteMeteorologicalOrgan(): Controller {
    return new DeleteMeteorologicalOrganController(
      EquipmentsUseCasesFactory.makeDeleteMeteorologicalOrgan()
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
      EquipmentsUseCasesFactory.makeUpdateEquipment()
    );
  }
  static makeUpdateMeteorologicalOrgan(): Controller {
    return new UpdateMeteorologicalOrganController(
      EquipmentsUseCasesFactory.makeUpdateMeteorologicalOrgan()
    );
  }

  static makeFetchEquipmentsWithYesterdayMeasurementsController(): Controller {
    return new FetchEquipmentsWithYesterdayMeasurementsController(
      EquipmentsUseCasesFactory.makeFetchEquipmentsWithYesterdayMeasurements()
    );
  }
}
