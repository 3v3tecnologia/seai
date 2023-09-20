import { FetchStationsReadsController } from "../../../../../presentation/controllers/equipments-controller/fetch-stations-reads.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeFetchStationsReads } from "../../use-cases/equipments";

export const makeFetchStationsReadsController = (): Controller => {
  return new FetchStationsReadsController(makeFetchStationsReads());
};
