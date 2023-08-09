import { FetchCaptationByCountyController } from "../../../../../presentation/controllers/captation-census-controller/fetch-captation-by-county.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchCaptationCensusByCounty } from "../../use-cases/captation-census/fetch-aquaculture-by-county-factory";

export const makeFetchCaptationCensusByCountyController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchCaptationByCountyController(makeFetchCaptationCensusByCounty())
  );
};
