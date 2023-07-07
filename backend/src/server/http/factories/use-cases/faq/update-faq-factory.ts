import { UpdateFaq } from "../../../../../domain/use-cases/faq/update-faq/update-faq";
import { KnexFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeUpdateFaq = (): UpdateFaq => {
  const repository = new KnexFaqRepository();
  return new UpdateFaq(repository);
};
