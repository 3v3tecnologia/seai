import { CreateCronController } from "../../../../../presentation/controllers/jobs";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeDeleteCronUseCase } from "../../use-cases";

export const makeDeleteCronController = (): Controller => {
  return makeLogControllerDecorator(
    new CreateCronController(makeDeleteCronUseCase())
  );
};
