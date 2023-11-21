import { FetchStationReadsByIdReadController } from "../../../../../presentation/controllers/equipments-controller/fetch-station-reads-by-id-read.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeFetchStationReadsByIdRead } from "../../use-cases/equipments";

export const makeFetchStationReadsByIdReadController = (): Controller => {
  return new FetchStationReadsByIdReadController(
    makeFetchStationReadsByIdRead()
  );
};
