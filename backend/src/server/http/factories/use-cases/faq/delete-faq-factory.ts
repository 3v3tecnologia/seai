import { DeleteFaq } from "../../../../../domain/use-cases/faq/delete-faq/delete-faq";
import { KnexFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeDeleteFaq = (): DeleteFaq => {
  const repository = new KnexFaqRepository();
  return new DeleteFaq(repository);
};
