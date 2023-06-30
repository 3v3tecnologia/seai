import { DeleteFaqCategory } from "../../../../../domain/use-cases/faq/delete-faq-category/delete-faq-category";
import { DeleteFaqCategoryProtocol } from "../../../../../domain/use-cases/faq/delete-faq-category/ports/delete-faq-category";
import { FaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeDeleteFaqCategory = (): DeleteFaqCategoryProtocol => {
  const repository = new FaqRepository();
  return new DeleteFaqCategory(repository);
};
