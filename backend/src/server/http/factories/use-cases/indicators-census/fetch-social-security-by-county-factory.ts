import { FetchSocialSecurityCensusByCounty } from "../../../../../domain/use-cases/indicators-census/fetch-social-security-by-county";
import { KnexIndicatorsRepository } from "../../../../../infra/database/postgres/repositories/indicators-census-repository";

export const makeFetchSocialSecurityCensusByCounty =
  (): FetchSocialSecurityCensusByCounty => {
    const repository = new KnexIndicatorsRepository();
    return new FetchSocialSecurityCensusByCounty(repository);
  };
