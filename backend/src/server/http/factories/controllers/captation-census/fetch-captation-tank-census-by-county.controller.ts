import { FetchCaptationTankByCountyController } from "../../../../../presentation/controllers/captation-census-controller/fetch-captation-tank-by-county.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchCaptationTankCensusByCounty } from "../../use-cases/captation-census/fetch-captation-tank-by-county-factory";

export const makeFetchCaptationTankCensusByCountyController =
  (): Controller => {
    return makeLogControllerDecorator(
      new FetchCaptationTankByCountyController(
        makeFetchCaptationTankCensusByCounty()
      )
    );
  };
