import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { CreateUserController } from "../../../../../presentation/controllers/user-controller/create-user.controller";
import { makeLogControllerDecorator } from "../../decorators";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";
import { makeCreateUser } from "../../use-cases/user/create-user-usecase-factory";

export const makeCreateUserController = (): Controller => {
  return makeLogControllerDecorator(
    new CreateUserController(makeCreateUser(), makeRegisterUserLogs())
  );
};
