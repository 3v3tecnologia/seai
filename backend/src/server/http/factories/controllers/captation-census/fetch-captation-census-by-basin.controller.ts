import { FetchCaptationByBasinController } from "../../../../../presentation/controllers/captation-census-controller/fetch-captation-by-basin.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchCaptationCensusByBasin } from "../../use-cases/captation-census/fetch-captation-by-basin-factory";

export const makeFetchCaptationCensusByBasinController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchCaptationByBasinController(makeFetchCaptationCensusByBasin())
  );
};
