import { FetchFaqById } from "../../../../../domain/use-cases/faq/fetch-faq-by-id/fetch-faq-by-id";
import { FetchFaqByIdProtocol } from "../../../../../domain/use-cases/faq/fetch-faq-by-id/ports/fetch-faq-by-id";
import { KnexFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeFetchFaqById = (): FetchFaqByIdProtocol => {
  const repository = new KnexFaqRepository();
  return new FetchFaqById(repository);
};
