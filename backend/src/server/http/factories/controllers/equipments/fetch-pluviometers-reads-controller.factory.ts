import { FetchPluviometersReadsController } from "../../../../../presentation/controllers/equipments-controller/fetch-pluviometers-reads.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeFetchPluviometersReads } from "../../use-cases/equipments";

export const makeFetchPluviometersReadsController = (): Controller => {
  return new FetchPluviometersReadsController(makeFetchPluviometersReads());
};
