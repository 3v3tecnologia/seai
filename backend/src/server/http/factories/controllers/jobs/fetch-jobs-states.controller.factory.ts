import { FetchJobsStatesController } from "../../../../../presentation/controllers/jobs";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeFetchJobsStatesUseCase } from "../../use-cases";

export const makeFetchJobsStatesController = (): Controller => {
  return new FetchJobsStatesController(makeFetchJobsStatesUseCase());
};
