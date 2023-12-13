import { FetchAllNews } from "../../../../../domain/use-cases/newsletter";
import { DbNewsLetterContentRepository } from "../../../../../infra/database/postgres/repositories/newsletter-content-repository";

export const makeFetchAllNewsletter = (): FetchAllNews => {
  const accountRepository = new DbNewsLetterContentRepository();
  return new FetchAllNews(accountRepository);
};
