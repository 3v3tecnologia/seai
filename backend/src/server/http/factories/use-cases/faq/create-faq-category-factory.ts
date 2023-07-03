import { CreateFaqCategory } from "../../../../../domain/use-cases/faq/create-category/create-faq-category";
import { CreateFaqCategoryProtocol } from "../../../../../domain/use-cases/faq/create-category/ports/create-faq-category";
import { PostgreSQLFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeCreateFaqCategory = (): CreateFaqCategoryProtocol => {
  const repository = new PostgreSQLFaqRepository();
  return new CreateFaqCategory(repository);
};
