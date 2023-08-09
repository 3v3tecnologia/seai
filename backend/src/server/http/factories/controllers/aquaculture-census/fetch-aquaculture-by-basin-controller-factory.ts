import { FetchAquacultureByBasinController } from "../../../../../presentation/controllers/aquaculture-reports-controller/fetch-aquaculture-by-basin.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchAquacultureCensusByBasin } from "../../use-cases/aquaculture-census/fetch-aquaculture-by-basin-factory";

export const makeFetchAquacultureCensusByBasinController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchAquacultureByBasinController(makeFetchAquacultureCensusByBasin())
  );
};
