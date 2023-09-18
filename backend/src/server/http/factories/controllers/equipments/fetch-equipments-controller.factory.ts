import { FetchEquipmentsController } from "../../../../../presentation/controllers/equipments-controller/fetch-equipments.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeFetchEquipments } from "../../use-cases/equipments";

export const makeFetchEquipmentsController = (): Controller => {
  return new FetchEquipmentsController(makeFetchEquipments());
};
