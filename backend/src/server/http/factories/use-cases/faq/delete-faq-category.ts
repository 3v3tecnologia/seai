import { DeleteFaqCategory } from "../../../../../domain/use-cases/faq/delete-faq-category/delete-faq-category";
import { DeleteFaqCategoryProtocol } from "../../../../../domain/use-cases/faq/delete-faq-category/ports/delete-faq-category";
import { PostgreSQLFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeDeleteFaqCategory = (): DeleteFaqCategoryProtocol => {
  const repository = new PostgreSQLFaqRepository();
  return new DeleteFaqCategory(repository);
};
