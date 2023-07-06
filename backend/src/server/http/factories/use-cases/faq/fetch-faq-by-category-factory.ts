import { FetchFaqByCategory } from "../../../../../domain/use-cases/faq/fetch-faq-by-category/fetch-faq-by-category";
import { FetchFaqByCategoryProtocol } from "../../../../../domain/use-cases/faq/fetch-faq-by-category/ports/fetch-faq-by-category";
import { KnexFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeFetchFaqByCategory = (): FetchFaqByCategoryProtocol => {
  const repository = new KnexFaqRepository();
  return new FetchFaqByCategory(repository);
};
