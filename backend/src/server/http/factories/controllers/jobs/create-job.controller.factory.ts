import { CreateJobController } from "../../../../../presentation/controllers/jobs";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeCreateJobUseCase } from "../../use-cases";

export const makeCreateJobController = (): Controller => {
  return makeLogControllerDecorator(
    new CreateJobController(makeCreateJobUseCase())
  );
};
