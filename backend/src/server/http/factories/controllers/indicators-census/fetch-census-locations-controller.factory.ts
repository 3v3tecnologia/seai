import { FetchCensusLocationsController } from "../../../../../presentation/controllers/census-locations-controller/fetch-census-locations.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchCensusLocations } from "../../use-cases/indicators-census/fetch-census-locations-factory";

export const makeFetchCensusLocationsController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchCensusLocationsController(makeFetchCensusLocations())
  );
};
