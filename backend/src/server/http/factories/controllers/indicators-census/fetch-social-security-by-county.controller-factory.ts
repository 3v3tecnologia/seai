import { FetchSoilSecurityCensusByCountyController } from "../../../../../presentation/controllers/indicators-census/fetch-social-security-by-county.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchSocialSecurityCensusByCounty } from "../../use-cases/indicators-census";

export const makeFetchSocialSecurityCensusByCountyController =
  (): Controller => {
    return makeLogControllerDecorator(
      new FetchSoilSecurityCensusByCountyController(
        makeFetchSocialSecurityCensusByCounty()
      )
    );
  };
