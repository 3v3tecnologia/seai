import { FetchEconomicSecurityCensusByCountyController } from "../../../../../presentation/controllers/indicators-census/fetch-economic-security-by-county.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchEconomicSecurityCensusByCounty } from "../../use-cases/indicators-census";

export const makeFetchEconomicSecurityCensusByCountyController =
  (): Controller => {
    return makeLogControllerDecorator(
      new FetchEconomicSecurityCensusByCountyController(
        makeFetchEconomicSecurityCensusByCounty()
      )
    );
  };
