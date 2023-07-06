import { FetchFaqCategories } from "../../../../../domain/use-cases/faq/fetch-faq-categories/fetch-faq-categories";
import { FetchFaqCategoriesProtocol } from "../../../../../domain/use-cases/faq/fetch-faq-categories/ports/fetch-faq-categories";
import { KnexFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeFetchFaqByCategories = (): FetchFaqCategoriesProtocol => {
  const repository = new KnexFaqRepository();
  return new FetchFaqCategories(repository);
};
