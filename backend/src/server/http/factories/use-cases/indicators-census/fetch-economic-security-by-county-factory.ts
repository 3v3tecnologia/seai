import { FetchEconomicSecurityCensusByCounty } from "../../../../../domain/use-cases/indicators-census/fetch-economic-security-by-county";
import { KnexIndicatorsRepository } from "../../../../../infra/database/postgres/repositories/indicators-census-repository";

export const makeFetchEconomicSecurityCensusByCounty =
  (): FetchEconomicSecurityCensusByCounty => {
    const repository = new KnexIndicatorsRepository();
    return new FetchEconomicSecurityCensusByCounty(repository);
  };
