import { SignIn } from "../../../../../domain/use-cases/user/sign-in";
import { makeUserAuthentication } from "./authentication-factory";

export const makeUserSignIn = (): SignIn => {
  return new SignIn(makeUserAuthentication());
};
