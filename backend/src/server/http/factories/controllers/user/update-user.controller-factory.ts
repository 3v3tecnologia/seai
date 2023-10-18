import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { UpdateUserController } from "../../../../../presentation/controllers/user-controller/update-user.controller";
import { makeLogControllerDecorator } from "../../decorators";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";
import { makeUpdateUser } from "../../use-cases/user/update-user-usecase-factory";

export const makeUpdateUserController = (): Controller => {
  return makeLogControllerDecorator(
    new UpdateUserController(makeUpdateUser(), makeRegisterUserLogs())
  );
};
