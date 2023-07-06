import { CreateFaq } from "../../../../../domain/use-cases/faq/create-faq/create-faq";
import { CreateFaqProtocol } from "../../../../../domain/use-cases/faq/create-faq/ports/create-faq";
import { KnexFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeCreateFaq = (): CreateFaqProtocol => {
  const repository = new KnexFaqRepository();
  return new CreateFaq(repository);
};
