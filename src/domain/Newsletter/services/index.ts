import env from "../../../server/http/env";
import { BcryptAdapter } from "../../../shared/infra/cryptography/bcrypt-adapter";
import { PgBossAdapter } from "../../../shared/infra/queueProvider/pg-boss";
import { NewsLetterRepository } from "../infra/database/repository/newsletter.repository";
import { NewsletterService } from "./newsletter.service";



export const newsletterService = new NewsletterService(new NewsLetterRepository(), new PgBossAdapter(), new BcryptAdapter(env.hashSalt))
