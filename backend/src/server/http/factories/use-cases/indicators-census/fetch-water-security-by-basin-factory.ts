import { FetchWaterSecurityCensusByBasin } from "../../../../../domain/use-cases/indicators-census/fetch-water-security-by-basin";
import { KnexIndicatorsRepository } from "../../../../../infra/database/postgres/repositories/indicators-census-repository";

export const makeFetchWaterSecurityCensusByBasin =
  (): FetchWaterSecurityCensusByBasin => {
    const repository = new KnexIndicatorsRepository();
    return new FetchWaterSecurityCensusByBasin(repository);
  };
