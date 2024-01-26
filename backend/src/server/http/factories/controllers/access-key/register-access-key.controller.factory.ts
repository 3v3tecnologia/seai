import { RegisterAccessKeyController } from "../../../../../presentation/controllers/api-key";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeRegisterAccessKeyUseCase } from "../../use-cases/access-key/register-access-key.useCase.factory";

export const makeRegisterAccessKeyController = (): Controller => {
  return makeLogControllerDecorator(
    new RegisterAccessKeyController(makeRegisterAccessKeyUseCase())
  );
};
