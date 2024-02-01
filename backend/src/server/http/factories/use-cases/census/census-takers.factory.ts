import { FetchCensusTakersCensusByBasin } from "../../../../../domain/use-cases/census/fetch-census-takers-by-basin";
import { FetchCensusTakersCensusByCounty } from "../../../../../domain/use-cases/census/fetch-census-takers-by-county";
import { DbCensusTakersRepository } from "../../../../../infra/database/postgres/repositories/census-takers-census-repository";

export class CensusTakersUseCasesFactory {
  private static repository = new DbCensusTakersRepository();

  static makeFetchCensusTakersCensusByBasin(): FetchCensusTakersCensusByBasin {
    return new FetchCensusTakersCensusByBasin(this.repository);
  }

  static makeFetchCensusTakersCensusByCounty(): FetchCensusTakersCensusByCounty {
    return new FetchCensusTakersCensusByCounty(this.repository);
  }
}
