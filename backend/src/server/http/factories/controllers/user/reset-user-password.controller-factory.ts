import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { ResetPasswordController } from "../../../../../presentation/controllers/user-controller/reset-password.controller";
import { makeLogControllerDecorator } from "../../decorators";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";
import { makeResetUserPassword } from "../../use-cases/user/reset-user-password-factory";

export const makeResetUserController = (): Controller => {
  return makeLogControllerDecorator(
    new ResetPasswordController(makeResetUserPassword(), makeRegisterUserLogs())
  );
};
