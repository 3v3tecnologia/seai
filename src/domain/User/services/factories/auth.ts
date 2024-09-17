import env from "../../../../server/http/env";
import { BcryptAdapter } from "../../../../shared/infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../../shared/infra/cryptography/jwt-adapter";
import { GovernmentUserRepository } from "../../infra/repositories/gov-user-repository";
import { AuthService } from "../authentication.service";


export const authService = new AuthService(
    new GovernmentUserRepository(),
    new JwtAdapter(env.jwtSecret),
    new BcryptAdapter(env.hashSalt),
);