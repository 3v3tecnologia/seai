import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { ForgotPasswordController } from "../../../../../presentation/controllers/user-controller/forgot-password.controller";
import { makeLogControllerDecorator } from "../../decorators";
import { makeForgotPasswordUser } from "../../use-cases/user/forgot-password-factory";

export const makeForgotPasswordController = (): Controller => {
  return makeLogControllerDecorator(
    new ForgotPasswordController(makeForgotPasswordUser())
  );
};
