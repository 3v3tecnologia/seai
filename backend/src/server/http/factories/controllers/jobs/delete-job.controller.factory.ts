import { DeleteJobController } from "../../../../../presentation/controllers/jobs";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeDeleteJobUseCase } from "../../use-cases";

export const makeDeleteJobController = (): Controller => {
  return makeLogControllerDecorator(
    new DeleteJobController(makeDeleteJobUseCase())
  );
};
