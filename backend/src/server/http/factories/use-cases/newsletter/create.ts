import { CreateNews } from "../../../../../domain/use-cases/newsletter";
import { DbNewsLetterContentRepository } from "../../../../../infra/database/postgres/repositories/newsletter-content-repository";
import { makeCreateJobUseCase } from "../jobs";

export const makeCreateNewsletterController = (): CreateNews => {
  const accountRepository = new DbNewsLetterContentRepository();
  return new CreateNews(accountRepository, makeCreateJobUseCase());
};
