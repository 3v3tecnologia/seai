import {
  FetchCaptationCensusByBasin,
  FetchCaptationCensusByCounty,
} from "../../../../../domain/use-cases/census";
import { DbCaptationCensusRepository } from "../../../../../infra/database/postgres/repositories/captation-repository";

export class CaptationUseCasesFactory {
  private static repository = new DbCaptationCensusRepository();

  static makeFetchCaptationCensusByBasin(): FetchCaptationCensusByBasin {
    return new FetchCaptationCensusByBasin(this.repository);
  }

  static makeFetchCaptationCensusByCounty(): FetchCaptationCensusByCounty {
    return new FetchCaptationCensusByCounty(this.repository);
  }
}
