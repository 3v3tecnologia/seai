import { FetchFaqCategories } from "../../../../../domain/use-cases/faq/fetch-faq-categories/fetch-faq-categories";
import { FetchFaqCategoriesProtocol } from "../../../../../domain/use-cases/faq/fetch-faq-categories/ports/fetch-faq-categories";
import { PostgreSQLFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeFetchFaqByCategories = (): FetchFaqCategoriesProtocol => {
  const repository = new PostgreSQLFaqRepository();
  return new FetchFaqCategories(repository);
};
