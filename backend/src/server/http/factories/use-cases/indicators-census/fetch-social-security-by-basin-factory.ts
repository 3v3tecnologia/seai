import { FetchSocialSecurityCensusByBasin } from "../../../../../domain/use-cases/indicators-census/fetch-social-security-by-basin";
import { KnexIndicatorsRepository } from "../../../../../infra/database/postgres/repositories/indicators-census-repository";

export const makeFetchSocialSecurityCensusByBasin =
  (): FetchSocialSecurityCensusByBasin => {
    const repository = new KnexIndicatorsRepository();
    return new FetchSocialSecurityCensusByBasin(repository);
  };
