import {
  FetchAnimalsCensusByBasinController,
  FetchAnimalsCensusByCityController,
  FetchAnimalsConsumptionCensusController,
  FetchAquacultureByBasinController,
  FetchAquacultureByCountyController,
  FetchCaptationByBasinController,
  FetchCaptationByCountyController,
  FetchCaptationTankByBasinController,
  FetchCaptationTankByCountyController,
  FetchCensusTakersByBasinController,
  FetchCensusTakersByCountyController,
  FetchWorkersByBasinController,
  FetchWorkersByCountyController,
} from "../../../../presentation/controllers/census";
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
