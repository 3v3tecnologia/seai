import { FetchWaterSecurityCensusByCountyController } from "../../../../../presentation/controllers/indicators-census/fetch-water-security-by-county.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchWaterSecurityCensusByCounty } from "../../use-cases/indicators-census";

export const makeFetchWaterSecurityCensusByCountyController =
  (): Controller => {
    return makeLogControllerDecorator(
      new FetchWaterSecurityCensusByCountyController(
        makeFetchWaterSecurityCensusByCounty()
      )
    );
  };
