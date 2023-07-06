import { CreateFaqCategory } from "../../../../../domain/use-cases/faq/create-category";
import { CreateFaqCategoryProtocol } from "../../../../../domain/use-cases/faq/create-category/protocol";
import { KnexFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeCreateFaqCategory = (): CreateFaqCategoryProtocol => {
  const repository = new KnexFaqRepository();
  return new CreateFaqCategory(repository);
};
