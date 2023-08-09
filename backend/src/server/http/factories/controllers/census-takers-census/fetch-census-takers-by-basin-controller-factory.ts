import { FetchCensusTakersByBasinController } from "../../../../../presentation/controllers/census-takers-census/fetch-census-takers-by-basin.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchCensusTakersCensusByBasin } from "../../use-cases/census-takers-census/fetch-census-takers-by-basin-factory";

export const makeFetchCensusTakersCensusByBasinController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchCensusTakersByBasinController(makeFetchCensusTakersCensusByBasin())
  );
};
