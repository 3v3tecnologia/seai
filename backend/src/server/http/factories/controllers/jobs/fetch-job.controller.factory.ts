import { FetchJobsController } from "../../../../../presentation/controllers/jobs";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchJobUseCase } from "../../use-cases";

export const makeFetchJobsController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchJobsController(makeFetchJobUseCase())
  );
};
