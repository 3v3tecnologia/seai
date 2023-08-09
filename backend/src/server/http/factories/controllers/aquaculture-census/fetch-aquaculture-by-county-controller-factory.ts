import { FetchAquacultureByCountyController } from "../../../../../presentation/controllers/aquaculture-reports-controller/fetch-aquaculture-takers-by-county.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchAquacultureCensusByCounty } from "../../use-cases/aquaculture-census/fetch-aquaculture-by-county-factory";

export const makeFetchAquacultureCensusByCountyController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchAquacultureByCountyController(makeFetchAquacultureCensusByCounty())
  );
};
