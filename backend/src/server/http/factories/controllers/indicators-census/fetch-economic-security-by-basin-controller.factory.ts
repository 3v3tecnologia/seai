import { FetchEconomicSecurityCensusByBasinController } from "../../../../../presentation/controllers/indicators-census/fetch-economic-security-by-basin.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchEconomicSecurityCensusByBasin } from "../../use-cases/indicators-census";

export const makeFetchEconomicSecurityCensusByBasinController =
  (): Controller => {
    return makeLogControllerDecorator(
      new FetchEconomicSecurityCensusByBasinController(
        makeFetchEconomicSecurityCensusByBasin()
      )
    );
  };
