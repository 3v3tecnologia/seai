import { FetchAnimalsCensusByBasinController } from "../../../../presentation/controllers/census/fetch-animals-by-basin.controller";
import { FetchAnimalsCensusByCityController } from "../../../../presentation/controllers/census/fetch-animals-by-city.controller";
import { FetchAnimalsConsumptionCensusController } from "../../../../presentation/controllers/census/fetch-animals-consumption.controller";
import { FetchAquacultureByBasinController } from "../../../../presentation/controllers/census/fetch-aquaculture-by-basin.controller";
import { FetchAquacultureByCountyController } from "../../../../presentation/controllers/census/fetch-aquaculture-takers-by-county.controller";
import { FetchCaptationByBasinController } from "../../../../presentation/controllers/census/fetch-captation-by-basin.controller";
import { FetchCaptationByCountyController } from "../../../../presentation/controllers/census/fetch-captation-by-county.controller";
import { FetchCaptationTankByBasinController } from "../../../../presentation/controllers/census/fetch-captation-tank-by-basin.controller";
import { FetchCaptationTankByCountyController } from "../../../../presentation/controllers/census/fetch-captation-tank-by-county.controller";
import { FetchCensusTakersByBasinController } from "../../../../presentation/controllers/census/fetch-census-takers-by-basin.controller";
import { FetchCensusTakersByCountyController } from "../../../../presentation/controllers/census/fetch-census-takers-by-county.controller";
import { FetchWorkersByBasinController } from "../../../../presentation/controllers/census/fetch-workers-census-by-basin.controller";
import { FetchWorkersByCountyController } from "../../../../presentation/controllers/census/fetch-workers-census-by-county.controller";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../decorators";
import {
  AnimalsUseCasesFactory,
  AquacultureUseCasesFactory,
  CaptationUseCasesFactory,
  CensusTakersUseCasesFactory,
  WorkersCensusUseCasesFactory,
} from "../use-cases";

export class CensusControllersFactory {
  static makeFetchAnimalsCensusByBasin(): Controller {
    return makeLogControllerDecorator(
      new FetchAnimalsCensusByBasinController(
        AnimalsUseCasesFactory.makeFetchAnimalsCensusByBasin()
      )
    );
  }
  static makeFetchAnimalsCensusByCity(): Controller {
    return makeLogControllerDecorator(
      new FetchAnimalsCensusByCityController(
        AnimalsUseCasesFactory.makeFetchAnimalsCensusByCity()
      )
    );
  }
  static makeFetchAnimalsCensusByConsumption(): Controller {
    return makeLogControllerDecorator(
      new FetchAnimalsConsumptionCensusController(
        AnimalsUseCasesFactory.makeFetchAnimalsCensusConsumption()
      )
    );
  }
  static makeFetchAquacultureCensusByBasin(): Controller {
    return makeLogControllerDecorator(
      new FetchAquacultureByBasinController(
        AquacultureUseCasesFactory.makeFetchAquacultureCensusByBasin()
      )
    );
  }
  static makeFetchAquacultureCensusByCounty(): Controller {
    return makeLogControllerDecorator(
      new FetchAquacultureByCountyController(
        AquacultureUseCasesFactory.makeFetchAquacultureCensusByCounty()
      )
    );
  }
  static makeFetchCaptationCensusByBasin(): Controller {
    return makeLogControllerDecorator(
      new FetchCaptationByBasinController(
        CaptationUseCasesFactory.makeFetchCaptationCensusByBasin()
      )
    );
  }
  static makeFetchCaptationCensusByCounty(): Controller {
    return makeLogControllerDecorator(
      new FetchCaptationByCountyController(
        CaptationUseCasesFactory.makeFetchCaptationCensusByCounty()
      )
    );
  }
  static makeFetchCaptationTankCensusByBasin(): Controller {
    return makeLogControllerDecorator(
      new FetchCaptationTankByBasinController(
        AquacultureUseCasesFactory.makeFetchCaptationTankCensusByBasin()
      )
    );
  }
  static makeFetchCaptationTankCensusByCounty(): Controller {
    return makeLogControllerDecorator(
      new FetchCaptationTankByCountyController(
        AquacultureUseCasesFactory.makeFetchCaptationTankCensusByCounty()
      )
    );
  }
  static makeFetchCensusTakersCensusByBasin(): Controller {
    return makeLogControllerDecorator(
      new FetchCensusTakersByBasinController(
        CensusTakersUseCasesFactory.makeFetchCensusTakersCensusByBasin()
      )
    );
  }
  static makeFetchCensusTakersCensusByCounty(): Controller {
    return makeLogControllerDecorator(
      new FetchCensusTakersByCountyController(
        CensusTakersUseCasesFactory.makeFetchCensusTakersCensusByCounty()
      )
    );
  }
  static makeFetchWorkersCensusByBasin(): Controller {
    return makeLogControllerDecorator(
      new FetchWorkersByBasinController(
        WorkersCensusUseCasesFactory.makeFetchWorkersCensusCensusByBasin()
      )
    );
  }
  static makeFetchWorkersCensusByCounty(): Controller {
    return makeLogControllerDecorator(
      new FetchWorkersByCountyController(
        WorkersCensusUseCasesFactory.makeFetchWorkersCensusCensusByCounty()
      )
    );
  }
}
