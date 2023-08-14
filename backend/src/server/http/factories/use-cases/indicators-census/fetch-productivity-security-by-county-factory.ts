import { FetchProductivitySecurityCensusByCounty } from "../../../../../domain/use-cases/indicators-census/fetch-productivity-security-by-county";
import { KnexIndicatorsRepository } from "../../../../../infra/database/postgres/repositories/indicators-census-repository";

export const makeFetchProductivitySecurityCensusByCounty =
  (): FetchProductivitySecurityCensusByCounty => {
    const repository = new KnexIndicatorsRepository();
    return new FetchProductivitySecurityCensusByCounty(repository);
  };
