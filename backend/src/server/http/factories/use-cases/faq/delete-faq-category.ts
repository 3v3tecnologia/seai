import { DeleteFaqCategory } from "../../../../../domain/use-cases/faq/delete-faq-category/delete-faq-category";
import { KnexFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeDeleteFaqCategory = (): DeleteFaqCategory => {
  const repository = new KnexFaqRepository();
  return new DeleteFaqCategory(repository);
};
