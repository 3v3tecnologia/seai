import { FetchSoilSecurityCensusByBasinController } from "../../../../../presentation/controllers/indicators-census/fetch-social-security-by-basin.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchSocialSecurityCensusByBasin } from "../../use-cases/indicators-census";

export const makeFetchSocialSecurityCensusByBasinController =
  (): Controller => {
    return makeLogControllerDecorator(
      new FetchSoilSecurityCensusByBasinController(
        makeFetchSocialSecurityCensusByBasin()
      )
    );
  };
