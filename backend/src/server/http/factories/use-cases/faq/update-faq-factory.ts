import { UpdateFaqProtocol } from "../../../../../domain/use-cases/faq/update-faq/ports/update-faq";
import { UpdateFaq } from "../../../../../domain/use-cases/faq/update-faq/update-faq";
import { PostgreSQLFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeUpdateFaq = (): UpdateFaqProtocol => {
  const repository = new PostgreSQLFaqRepository();
  return new UpdateFaq(repository);
};
