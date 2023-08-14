import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { LoadUserAccessController } from "../../../../../presentation/controllers/user-controller/load-user-acess.controller";
import { makeLogControllerDecorator } from "../../decorators";
import { makeGetUsersAccessModules } from "../../use-cases/user/load-user-modules-factory";

export const makeGetUserAccessModulesController = (): Controller => {
  return makeLogControllerDecorator(
    new LoadUserAccessController(makeGetUsersAccessModules())
  );
};
