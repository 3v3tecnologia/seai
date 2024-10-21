import env from "../../../../server/http/env";
import { BcryptAdapter } from "../../../../shared/infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../shared/infra/cryptography/jwt-adapter";
import { AuthRepository } from "../../infra/repository/auth.repository";
import { AuthService } from "../authentication.service";


export const authService = new AuthService(
  new AuthRepository(),
  new JwtAdapter(env.jwtSecret),
  new BcryptAdapter(env.hashSalt),
);
