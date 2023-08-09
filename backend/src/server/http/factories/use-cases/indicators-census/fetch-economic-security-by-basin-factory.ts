import { FetchEconomicSecurityCensusByBasin } from "../../../../../domain/use-cases/indicators-census/fetch-economic-security-by-basin";
import { KnexIndicatorsRepository } from "../../../../../infra/database/postgres/repositories/indicators-census-repository";

export const makeFetchEconomicSecurityCensusByBasin =
  (): FetchEconomicSecurityCensusByBasin => {
    const repository = new KnexIndicatorsRepository();
    return new FetchEconomicSecurityCensusByBasin(repository);
  };
