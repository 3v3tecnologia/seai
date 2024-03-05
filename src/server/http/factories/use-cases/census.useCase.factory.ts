import {
  FetchAnimalsCensusByBasin,
  FetchAnimalsCensusByCity,
  FetchAnimalsCensusByConsumption,
  FetchAquacultureCensusByBasin,
  FetchAquacultureCensusByCounty,
  FetchCaptationCensusByBasin,
  FetchCaptationCensusByCounty,
  FetchCaptationTankCensusByBasin,
  FetchCaptationTankCensusByCounty,
  FetchCensusTakersCensusByBasin,
  FetchCensusTakersCensusByCounty,
  FetchWorkersCensusByBasin,
  FetchWorkersCensusByCounty,
} from "../../../../domain/use-cases/census";
import { DbAnimalsCensusRepository } from "../../../../infra/database/postgres/repositories/animals-census-repository";
import { DbAquacultureCensusRepository } from "../../../../infra/database/postgres/repositories/aquaculture-census-repository";
import { DbCaptationCensusRepository } from "../../../../infra/database/postgres/repositories/captation-repository";
import { DbCensusTakersRepository } from "../../../../infra/database/postgres/repositories/census-takers-census-repository";
import { DbWorkersCensusRepository } from "../../../../infra/database/postgres/repositories/worker-census-repository";

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

export class AquacultureUseCasesFactory {
  private static repository = new DbAquacultureCensusRepository();

  static makeFetchCaptationTankCensusByBasin(): FetchCaptationTankCensusByBasin {
    return new FetchCaptationTankCensusByBasin(this.repository);
  }

  static makeFetchCaptationTankCensusByCounty(): FetchCaptationTankCensusByCounty {
    return new FetchCaptationTankCensusByCounty(this.repository);
  }

  static makeFetchAquacultureCensusByBasin(): FetchAquacultureCensusByBasin {
    return new FetchAquacultureCensusByBasin(this.repository);
  }

  static makeFetchAquacultureCensusByCounty(): FetchAquacultureCensusByCounty {
    return new FetchAquacultureCensusByCounty(this.repository);
  }
}

export class CaptationUseCasesFactory {
  private static repository = new DbCaptationCensusRepository();

  static makeFetchCaptationCensusByBasin(): FetchCaptationCensusByBasin {
    return new FetchCaptationCensusByBasin(this.repository);
  }

  static makeFetchCaptationCensusByCounty(): FetchCaptationCensusByCounty {
    return new FetchCaptationCensusByCounty(this.repository);
  }
}

export class CensusTakersUseCasesFactory {
  private static repository = new DbCensusTakersRepository();

  static makeFetchCensusTakersCensusByBasin(): FetchCensusTakersCensusByBasin {
    return new FetchCensusTakersCensusByBasin(this.repository);
  }

  static makeFetchCensusTakersCensusByCounty(): FetchCensusTakersCensusByCounty {
    return new FetchCensusTakersCensusByCounty(this.repository);
  }
}

export class WorkersCensusUseCasesFactory {
  private static repository = new DbWorkersCensusRepository();

  static makeFetchWorkersCensusCensusByBasin(): FetchWorkersCensusByBasin {
    return new FetchWorkersCensusByBasin(this.repository);
  }

  static makeFetchWorkersCensusCensusByCounty(): FetchWorkersCensusByCounty {
    return new FetchWorkersCensusByCounty(this.repository);
  }
}
