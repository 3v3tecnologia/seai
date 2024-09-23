import env from "../../../../server/http/env";
import { BcryptAdapter } from "../../../../shared/infra/cryptography/bcrypt-adapter";
import { PgBossAdapter } from "../../../../shared/infra/queueProvider/pg-boss";
import { GovernmentUserRepository } from "../../infra/repositories/gov-user-repository";
import { GovernmentUserService } from "../gov-user.service";


export const govUserService = new GovernmentUserService(
    new GovernmentUserRepository(),
    new BcryptAdapter(env.hashSalt),
    new PgBossAdapter(),
);