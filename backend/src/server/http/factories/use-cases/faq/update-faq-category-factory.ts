import { UpdateFaqCategory } from "../../../../../domain/use-cases/faq/update-faq-category/update-faq-category";
import { KnexFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeUpdateFaqCategory = (): UpdateFaqCategory => {
  const repository = new KnexFaqRepository();
  return new UpdateFaqCategory(repository);
};
