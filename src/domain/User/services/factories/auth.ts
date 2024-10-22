import { AuthService } from "../authentication.service";
import { govUserService } from "./gov-user";
import { irrigantUserAccountService } from "./irrigation-user";


export const authService = new AuthService(
  govUserService,
  irrigantUserAccountService
);
