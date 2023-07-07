import { CreateFaq } from "../../../../../domain/use-cases/faq/create-faq/create-faq";
import { KnexFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeCreateFaq = (): CreateFaq => {
  const repository = new KnexFaqRepository();
  return new CreateFaq(repository);
};
