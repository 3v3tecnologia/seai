import { FetchAnimalsCensusByCityController } from "../../../../../presentation/controllers/animals-census-controller/fetch-animals-by-city.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchAnimalsCensusByCity } from "../../use-cases/animals-census/fetch-by-city-factory";

export const makeFetchAnimalsCensusByCityController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchAnimalsCensusByCityController(makeFetchAnimalsCensusByCity())
  );
};
