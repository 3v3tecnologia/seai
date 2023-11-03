import { FetchMeteorologicalOrganController } from "../../../../../presentation/controllers/equipments-controller/fetch-meteorological-organ.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeFetchMeteorologicalOrgan } from "../../use-cases/equipments/fetch-meteorological-organ";

export const makeFetchMeteorologicalOrganController = (): Controller => {
  return new FetchMeteorologicalOrganController(makeFetchMeteorologicalOrgan());
};
