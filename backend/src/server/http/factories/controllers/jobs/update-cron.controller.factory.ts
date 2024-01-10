import { UpdateCronController } from "../../../../../presentation/controllers/jobs";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeUpdateCronUseCase } from "../../use-cases";

export const makeUpdateCronController = (): Controller => {
  return makeLogControllerDecorator(
    new UpdateCronController(makeUpdateCronUseCase())
  );
};
