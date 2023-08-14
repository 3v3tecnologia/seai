import { FetchProductivitySecurityCensusByBasin } from "../../../../../domain/use-cases/indicators-census/fetch-productivity-security-by-basin";
import { KnexIndicatorsRepository } from "../../../../../infra/database/postgres/repositories/indicators-census-repository";

export const makeFetchProductivitySecurityCensusByBasin =
  (): FetchProductivitySecurityCensusByBasin => {
    const repository = new KnexIndicatorsRepository();
    return new FetchProductivitySecurityCensusByBasin(repository);
  };
