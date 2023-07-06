import { DeleteFaq } from "../../../../../domain/use-cases/faq/delete-faq/delete-faq";
import { DeleteFaqProtocol } from "../../../../../domain/use-cases/faq/delete-faq/ports/delete-faq";
import { KnexFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeDeleteFaq = (): DeleteFaqProtocol => {
  const repository = new KnexFaqRepository();
  return new DeleteFaq(repository);
};
