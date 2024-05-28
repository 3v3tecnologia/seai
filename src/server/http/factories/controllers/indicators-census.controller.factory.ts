import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../decorators";
import { SecurityIndicatorsUseCaseFactory } from "../use-cases";

import { FetchCensusLocationsController } from "../../../../presentation/controllers/census";
import {
  FetchEconomicSecurityCensusByBasinController,
  FetchEconomicSecurityCensusByCountyController,
  FetchProductivitySecurityCensusByBasinController,
  FetchProductivitySecurityCensusByCountyController,
  FetchSoilSecurityCensusByBasinController,
  FetchSoilSecurityCensusByCountyController,
  FetchWaterSecurityCensusByBasinController,
  FetchWaterSecurityCensusByCountyController,
} from "../../../../presentation/controllers/indicators-census";

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
