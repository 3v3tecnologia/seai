import { FetchFaqWithCategories } from "../../../../../domain/use-cases/faq/fetch-faq-with-categories/fetch-faq-with-categories";
import { FetchFaqWithCategoriesProtocol } from "../../../../../domain/use-cases/faq/fetch-faq-with-categories/ports/fetch-faq-with-categories";
import { KnexFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeFetchFaqsWithCategories =
  (): FetchFaqWithCategoriesProtocol => {
    const repository = new KnexFaqRepository();
    return new FetchFaqWithCategories(repository);
  };
