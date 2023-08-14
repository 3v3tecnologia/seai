import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { FetchWorkersByBasinController } from "../../../../../presentation/controllers/workers-census-controller/fetch-workers-census-by-basin.controller";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchWorkersCensusCensusByBasin } from "../../use-cases/workers-census";

export const makeFetchWorkersCensusByBasinController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchWorkersByBasinController(makeFetchWorkersCensusCensusByBasin())
  );
};
