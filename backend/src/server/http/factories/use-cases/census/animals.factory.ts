import { FetchAnimalsCensusByBasin } from "../../../../../domain/use-cases/census/fetch-animals-by-basin";
import { FetchAnimalsCensusByCity } from "../../../../../domain/use-cases/census/fetch-animals-by-city";
import { FetchAnimalsCensusByConsumption } from "../../../../../domain/use-cases/census/fetch-animals-by-consumption";
import { DbAnimalsCensusRepository } from "../../../../../infra/database/postgres/repositories/animals-census-repository";

export class AnimalsUseCasesFactory {
  private static repository = new DbAnimalsCensusRepository();
  static makeFetchAnimalsCensusByBasin(): FetchAnimalsCensusByBasin {
    return new FetchAnimalsCensusByBasin(this.repository);
  }

  static makeFetchAnimalsCensusByCity(): FetchAnimalsCensusByCity {
    return new FetchAnimalsCensusByCity(this.repository);
  }

  static makeFetchAnimalsCensusConsumption(): FetchAnimalsCensusByConsumption {
    return new FetchAnimalsCensusByConsumption(this.repository);
  }
}
