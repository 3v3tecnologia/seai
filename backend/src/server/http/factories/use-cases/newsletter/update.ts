import { UpdateNews } from "../../../../../domain/use-cases/newsletter";
import { DbNewsLetterContentRepository } from "../../../../../infra/database/postgres/repositories/newsletter-content-repository";
import {
  makeCreateJobUseCase,
  makeFetchJobUseCase,
  makeUpdateJobUseCase,
} from "../jobs";

export const makeUpdateNewsletter = (): UpdateNews => {
  const newsRepository = new DbNewsLetterContentRepository();
  return new UpdateNews(
    newsRepository,
    makeCreateJobUseCase(),
    makeFetchJobUseCase(),
    makeUpdateJobUseCase()
  );
};
