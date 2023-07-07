import { CreateFaqCategory } from "../../../../../domain/use-cases/faq/create-category";
import { KnexFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeCreateFaqCategory = (): CreateFaqCategory => {
  const repository = new KnexFaqRepository();
  return new CreateFaqCategory(repository);
};
