import { FetchCaptationTankByBasinController } from "../../../../../presentation/controllers/captation-census-controller/fetch-captation-tank-by-basin.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchCaptationTankCensusByBasin } from "../../use-cases/captation-census/fetch-captation-tank-by-basin-factory";

export const makeFetchCaptationTankCensusByBasinController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchCaptationTankByBasinController(
      makeFetchCaptationTankCensusByBasin()
    )
  );
};
