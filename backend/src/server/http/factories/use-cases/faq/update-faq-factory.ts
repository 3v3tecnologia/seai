import { UpdateFaqProtocol } from "../../../../../domain/use-cases/faq/update-faq/ports/update-faq";
import { UpdateFaq } from "../../../../../domain/use-cases/faq/update-faq/update-faq";
import { FaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeUpdateFaq = (): UpdateFaqProtocol => {
  const repository = new FaqRepository();
  return new UpdateFaq(repository);
};
