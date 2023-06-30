import { DeleteFaq } from "../../../../../domain/use-cases/faq/delete-faq/delete-faq";
import { DeleteFaqProtocol } from "../../../../../domain/use-cases/faq/delete-faq/ports/delete-faq";
import { PostgreSQLFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeDeleteFaq = (): DeleteFaqProtocol => {
  const repository = new PostgreSQLFaqRepository();
  return new DeleteFaq(repository);
};
