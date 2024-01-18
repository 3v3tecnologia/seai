import { DeleteNews } from "../../../../../domain/use-cases/newsletter";
import { DbNewsLetterContentRepository } from "../../../../../infra/database/postgres/repositories/newsletter-content-repository";
import { makeDeleteJobUseCase } from "../jobs";

export const makeDeleteNewsletter = (): DeleteNews => {
  const accountRepository = new DbNewsLetterContentRepository();
  return new DeleteNews(accountRepository, makeDeleteJobUseCase());
};
