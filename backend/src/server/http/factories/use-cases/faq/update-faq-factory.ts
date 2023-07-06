import { UpdateFaqProtocol } from "../../../../../domain/use-cases/faq/update-faq/ports/update-faq";
import { UpdateFaq } from "../../../../../domain/use-cases/faq/update-faq/update-faq";
import { KnexFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeUpdateFaq = (): UpdateFaqProtocol => {
  const repository = new KnexFaqRepository();
  return new UpdateFaq(repository);
};
