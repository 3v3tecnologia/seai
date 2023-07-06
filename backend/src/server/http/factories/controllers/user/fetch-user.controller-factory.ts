import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { FetchUserController } from "../../../../../presentation/controllers/user-controller/fetch-user.controller";
import { makeLogControllerDecorator } from "../../decorators";
import { makeGetUsers } from "../../use-cases/user/get-users-factory";

export const makeGetUsersController = (): Controller => {
  return makeLogControllerDecorator(new FetchUserController(makeGetUsers()));
};
