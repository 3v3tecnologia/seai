import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { DeleteUserController } from "../../../../../presentation/controllers/user-controller/delete-user.controller";
import { makeLogControllerDecorator } from "../../decorators";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";
import { makeDeleteUser } from "../../use-cases/user/delete-user-factory";

export const makeDeleteUserController = (): Controller => {
  return makeLogControllerDecorator(
    new DeleteUserController(makeDeleteUser(), makeRegisterUserLogs())
  );
};
