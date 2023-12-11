import { UpdateNews } from "../../../../../domain/use-cases/newsletter";
import { DbNewsLetterContentRepository } from "../../../../../infra/database/postgres/repositories/newsletter-content-repository";

export const makeUpdateNewsletter = (): UpdateNews => {
  const accountRepository = new DbNewsLetterContentRepository();
  return new UpdateNews(accountRepository);
};
