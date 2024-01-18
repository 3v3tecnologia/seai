import { FetchByIdNews } from "../../../../../domain/use-cases/newsletter";
import { DbBackgroundJobsRepository } from "../../../../../infra/database/postgres/repositories/background-jobs-repository";
import { DbNewsLetterContentRepository } from "../../../../../infra/database/postgres/repositories/newsletter-content-repository";

export const makeFetchByIdNewsletter = (): FetchByIdNews => {
  const accountRepository = new DbNewsLetterContentRepository();
  return new FetchByIdNews(accountRepository, new DbBackgroundJobsRepository());
};
