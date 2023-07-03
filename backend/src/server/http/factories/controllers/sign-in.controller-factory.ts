import { SignIn } from "../../../../domain/use-cases/user/sign-in";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { SignInController } from "../../../../presentation/controllers/user-controller/sign-in.controller";
import { makeLogControllerDecorator } from "../decorators";
import { makeUserAuthentication } from "../use-cases/user/authentication-factory";

export const makeSignInController = (): Controller => {
  const authentication = makeUserAuthentication();
  const signIn = new SignIn(authentication);

  return makeLogControllerDecorator(new SignInController(signIn));
};
