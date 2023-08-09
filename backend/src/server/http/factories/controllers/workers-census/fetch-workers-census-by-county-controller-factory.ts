import { FetchWorkersCensusByCounty } from "../../../../../domain/use-cases/workers-census/fetch-workers-census-by-county";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { FetchWorkersByCountyController } from "../../../../../presentation/controllers/workers-census-controller/fetch-workers-census-by-county.controller";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchWorkersCensusCensusByCounty } from "../../use-cases/workers-census";

export const makeFetchWorkersCensusByCountyController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchWorkersByCountyController(makeFetchWorkersCensusCensusByCounty())
  );
};
