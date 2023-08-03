import { FetchCensusTakersByCountyController } from "../../../../../presentation/controllers/census-takers-census/fetch-census-takers-by-county.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchCensusTakersCensusByCounty } from "../../use-cases/census-takers-census/fetch-census-takers-by-county-factory";

export const makeFetchCensusTakersCensusByCountyController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchCensusTakersByCountyController(
      makeFetchCensusTakersCensusByCounty()
    )
  );
};
