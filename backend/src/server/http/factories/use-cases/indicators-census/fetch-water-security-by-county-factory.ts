import { FetchWaterSecurityCensusByCounty } from "../../../../../domain/use-cases/indicators-census/fetch-water-security-by-county";
import { KnexIndicatorsRepository } from "../../../../../infra/database/postgres/repositories/indicators-census-repository";

export const makeFetchWaterSecurityCensusByCounty =
  (): FetchWaterSecurityCensusByCounty => {
    const repository = new KnexIndicatorsRepository();
    return new FetchWaterSecurityCensusByCounty(repository);
  };
