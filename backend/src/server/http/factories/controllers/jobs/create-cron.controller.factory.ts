import { CreateCronController } from "../../../../../presentation/controllers/jobs";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeCreateCronUseCase } from "../../use-cases";

export const makeCreateCronController = (): Controller => {
  return makeLogControllerDecorator(
    new CreateCronController(makeCreateCronUseCase())
  );
};
