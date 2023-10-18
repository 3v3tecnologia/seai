import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { FetchUserByIdController } from "../../../../../presentation/controllers/user-controller/fetch-user-by-id";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchUserByIdModules } from "../../use-cases/user/load-user-modules-factory";

export const makeFetchUserByIdController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchUserByIdController(makeFetchUserByIdModules())
  );
};
