import { FetchAnimalsCensusByBasinController } from "../../../../../presentation/controllers/animals-census-controller/fetch-animals-by-basin.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchAnimalsCensusByBasin } from "../../use-cases/animals-census/fetch-by-basin-factory";

export const makeFetchAnimalsCensusByBasinController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchAnimalsCensusByBasinController(makeFetchAnimalsCensusByBasin())
  );
};
