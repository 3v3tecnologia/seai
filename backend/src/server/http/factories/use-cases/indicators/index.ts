import { FetchCensusLocations } from "../../../../../domain/use-cases/indicators-census/fetch-census-locations";
import { FetchEconomicSecurityCensusByBasin } from "../../../../../domain/use-cases/indicators-census/fetch-economic-security-by-basin";
import { FetchEconomicSecurityCensusByCounty } from "../../../../../domain/use-cases/indicators-census/fetch-economic-security-by-county";
import { FetchProductivitySecurityCensusByBasin } from "../../../../../domain/use-cases/indicators-census/fetch-productivity-security-by-basin";
import { FetchProductivitySecurityCensusByCounty } from "../../../../../domain/use-cases/indicators-census/fetch-productivity-security-by-county";
import { FetchSocialSecurityCensusByBasin } from "../../../../../domain/use-cases/indicators-census/fetch-social-security-by-basin";
import { FetchSocialSecurityCensusByCounty } from "../../../../../domain/use-cases/indicators-census/fetch-social-security-by-county";
import { FetchWaterSecurityCensusByBasin } from "../../../../../domain/use-cases/indicators-census/fetch-water-security-by-basin";
import { FetchWaterSecurityCensusByCounty } from "../../../../../domain/use-cases/indicators-census/fetch-water-security-by-county";
import { DbIndicatorsRepository } from "../../../../../infra/database/postgres/repositories/security-indicators.repository";

export class SecurityIndicatorsUseCaseFactory {
  private static repository = new DbIndicatorsRepository();
  // Remove from here ??
  static makeFetchLocations = (): FetchCensusLocations => {
    return new FetchCensusLocations(this.repository);
  };

  static makeFetchEconomicSecurityByBasin =
    (): FetchEconomicSecurityCensusByBasin => {
      return new FetchEconomicSecurityCensusByBasin(this.repository);
    };

  static makeFetchEconomicSecurityByCounty =
    (): FetchEconomicSecurityCensusByCounty => {
      return new FetchEconomicSecurityCensusByCounty(this.repository);
    };

  static makeFetchProductivitySecurityByBasin =
    (): FetchProductivitySecurityCensusByBasin => {
      return new FetchProductivitySecurityCensusByBasin(this.repository);
    };

  static makeFetchProductivitySecurityByCounty =
    (): FetchProductivitySecurityCensusByCounty => {
      return new FetchProductivitySecurityCensusByCounty(this.repository);
    };

  static makeFetchSocialSecurityByBasin =
    (): FetchSocialSecurityCensusByBasin => {
      return new FetchSocialSecurityCensusByBasin(this.repository);
    };

  static makeFetchSocialSecurityByCounty =
    (): FetchSocialSecurityCensusByCounty => {
      return new FetchSocialSecurityCensusByCounty(this.repository);
    };

  static makeFetchWaterSecurityByBasin =
    (): FetchWaterSecurityCensusByBasin => {
      return new FetchWaterSecurityCensusByBasin(this.repository);
    };

  static makeFetchWaterSecurityByCounty =
    (): FetchWaterSecurityCensusByCounty => {
      return new FetchWaterSecurityCensusByCounty(this.repository);
    };
}
