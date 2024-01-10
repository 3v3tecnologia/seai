import { UpdateJobController } from "../../../../../presentation/controllers/jobs";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeUpdateJobUseCase } from "../../use-cases";

export const makeUpdateJobController = (): Controller => {
  return makeLogControllerDecorator(
    new UpdateJobController(makeUpdateJobUseCase())
  );
};
