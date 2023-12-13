import { CreateNews } from "../../../../../domain/use-cases/newsletter";
import { DbNewsLetterContentRepository } from "../../../../../infra/database/postgres/repositories/newsletter-content-repository";

export const makeCreateNewsletterController = (): CreateNews => {
  const accountRepository = new DbNewsLetterContentRepository();
  return new CreateNews(accountRepository);
};
