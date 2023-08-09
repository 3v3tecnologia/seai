import { FetchProductivitySecurityCensusByBasinController } from "../../../../../presentation/controllers/indicators-census/fetch-productivity-security-by-basin.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchProductivitySecurityCensusByBasin } from "../../use-cases/indicators-census";

export const makeFetchProductivitySecurityCensusByBasinController =
  (): Controller => {
    return makeLogControllerDecorator(
      new FetchProductivitySecurityCensusByBasinController(
        makeFetchProductivitySecurityCensusByBasin()
      )
    );
  };
