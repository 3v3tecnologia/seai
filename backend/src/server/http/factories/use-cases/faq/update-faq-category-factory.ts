import { UpdateFaqCategoryProtocol } from "../../../../../domain/use-cases/faq/update-faq-category/ports/update-faq-category";
import { UpdateFaqCategory } from "../../../../../domain/use-cases/faq/update-faq-category/update-faq-category";
import { PostgreSQLFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeUpdateFaqCategory = (): UpdateFaqCategoryProtocol => {
  const repository = new PostgreSQLFaqRepository();
  return new UpdateFaqCategory(repository);
};
