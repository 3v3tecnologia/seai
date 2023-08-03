import { FetchWaterSecurityCensusByBasinController } from "../../../../../presentation/controllers/indicators-census/fetch-water-security-by-basin.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchWaterSecurityCensusByBasin } from "../../use-cases/indicators-census";

export const makeFetchWaterSecurityCensusByBasinController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchWaterSecurityCensusByBasinController(
      makeFetchWaterSecurityCensusByBasin()
    )
  );
};
