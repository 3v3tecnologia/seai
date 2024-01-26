import { DeleteAccessKeyController } from "../../../../../presentation/controllers/api-key";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeDeleteAccessKeyUseCase } from "../../use-cases/access-key";

export const makeDeleteAccessKeyController = (): Controller => {
  return makeLogControllerDecorator(
    new DeleteAccessKeyController(makeDeleteAccessKeyUseCase())
  );
};
