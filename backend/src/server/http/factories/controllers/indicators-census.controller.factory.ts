import { makeLogControllerDecorator } from "../decorators";
import { FetchEconomicSecurityCensusByBasinController } from "../../../../presentation/controllers/indicators-census/fetch-economic-security-by-basin.controller";
import { FetchEconomicSecurityCensusByCountyController } from "../../../../presentation/controllers/indicators-census/fetch-economic-security-by-county.controller";
import { FetchProductivitySecurityCensusByBasinController } from "../../../../presentation/controllers/indicators-census/fetch-productivity-security-by-basin.controller";
import { FetchSoilSecurityCensusByBasinController } from "../../../../presentation/controllers/indicators-census/fetch-social-security-by-basin.controller";
import { FetchSoilSecurityCensusByCountyController } from "../../../../presentation/controllers/indicators-census/fetch-social-security-by-county.controller";
import { FetchWaterSecurityCensusByBasinController } from "../../../../presentation/controllers/indicators-census/fetch-water-security-by-basin.controller";
import { FetchWaterSecurityCensusByCountyController } from "../../../../presentation/controllers/indicators-census/fetch-water-security-by-county.controller";
import { FetchCensusLocationsController } from "../../../../presentation/controllers/census/fetch-census-locations.controller";
import { SecurityIndicatorsUseCaseFactory } from "../use-cases";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { FetchProductivitySecurityCensusByCountyController } from "../../../../presentation/controllers/indicators-census/fetch-productivity-security-by-county.controller";

export class SecurityIndicatorsControllersFactory {
  static makeFetchCensusLocations(): Controller {
    return makeLogControllerDecorator(
      new FetchCensusLocationsController(
        SecurityIndicatorsUseCaseFactory.makeFetchLocations()
      )
    );
  }
  static makeFetchEconomicSecurityCensusByBasin(): Controller {
    return makeLogControllerDecorator(
      new FetchEconomicSecurityCensusByBasinController(
        SecurityIndicatorsUseCaseFactory.makeFetchEconomicSecurityByBasin()
      )
    );
  }
  static makeFetchEconomicSecurityCensusByCounty(): Controller {
    return makeLogControllerDecorator(
      new FetchEconomicSecurityCensusByCountyController(
        SecurityIndicatorsUseCaseFactory.makeFetchEconomicSecurityByCounty()
      )
    );
  }
  static makeFetchProductivitySecurityCensusByBasin(): Controller {
    return makeLogControllerDecorator(
      new FetchProductivitySecurityCensusByBasinController(
        SecurityIndicatorsUseCaseFactory.makeFetchProductivitySecurityByBasin()
      )
    );
  }
  static makeFetchProductivitySecurityCensusByCounty(): Controller {
    return makeLogControllerDecorator(
      new FetchProductivitySecurityCensusByCountyController(
        SecurityIndicatorsUseCaseFactory.makeFetchProductivitySecurityByCounty()
      )
    );
  }
  static makeFetchSocialSecurityCensusByBasin(): Controller {
    return makeLogControllerDecorator(
      new FetchSoilSecurityCensusByBasinController(
        SecurityIndicatorsUseCaseFactory.makeFetchSocialSecurityByBasin()
      )
    );
  }
  static makeFetchSocialSecurityCensusByCounty(): Controller {
    return makeLogControllerDecorator(
      new FetchSoilSecurityCensusByCountyController(
        SecurityIndicatorsUseCaseFactory.makeFetchSocialSecurityByCounty()
      )
    );
  }
  static makeFetchWaterSecurityCensusByBasin(): Controller {
    return makeLogControllerDecorator(
      new FetchWaterSecurityCensusByBasinController(
        SecurityIndicatorsUseCaseFactory.makeFetchWaterSecurityByBasin()
      )
    );
  }
  static makeFetchWaterSecurityCensusByCounty(): Controller {
    return makeLogControllerDecorator(
      new FetchWaterSecurityCensusByCountyController(
        SecurityIndicatorsUseCaseFactory.makeFetchWaterSecurityByCounty()
      )
    );
  }
}
