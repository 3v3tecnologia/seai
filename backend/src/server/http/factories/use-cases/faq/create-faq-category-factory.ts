import { CreateFaqCategory } from "../../../../../domain/use-cases/faq/create-category/create-faq-category";
import { CreateFaqCategoryProtocol } from "../../../../../domain/use-cases/faq/create-category/ports/create-faq-category";
import { FaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeCreateFaqCategory = (): CreateFaqCategoryProtocol => {
  const repository = new FaqRepository();
  return new CreateFaqCategory(repository);
};
