import { FetchAnimalsConsumptionCensusController } from "../../../../../presentation/controllers/animals-census-controller/fetch-consumption.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchAnimalsCensusConsumption } from "../../use-cases/animals-census/fetch-consumption-factory";

export const makeFetchAnimalsCensusByConsumptionController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchAnimalsConsumptionCensusController(
      makeFetchAnimalsCensusConsumption()
    )
  );
};
