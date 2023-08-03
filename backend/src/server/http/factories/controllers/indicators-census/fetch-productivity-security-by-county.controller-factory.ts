import { FetchProductivitySecurityCensusByCountyController } from "../../../../../presentation/controllers/indicators-census/fetch-productivity-security-by-county.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchProductivitySecurityCensusByCounty } from "../../use-cases/indicators-census";

export const makeFetchProductivitySecurityCensusByCountyController =
  (): Controller => {
    return makeLogControllerDecorator(
      new FetchProductivitySecurityCensusByCountyController(
        makeFetchProductivitySecurityCensusByCounty()
      )
    );
  };
