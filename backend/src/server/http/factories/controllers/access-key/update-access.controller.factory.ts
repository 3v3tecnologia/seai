import { UpdateAccessKeyController } from "../../../../../presentation/controllers/api-key";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeUpdateAccessKeyUseCase } from "../../use-cases/access-key";

export const makeUpdateAccessKeyController = (): Controller => {
  return makeLogControllerDecorator(
    new UpdateAccessKeyController(makeUpdateAccessKeyUseCase())
  );
};
