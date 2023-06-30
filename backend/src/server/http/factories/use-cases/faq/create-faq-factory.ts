import { CreateFaq } from "../../../../../domain/use-cases/faq/create-faq/create-faq";
import { CreateFaqProtocol } from "../../../../../domain/use-cases/faq/create-faq/ports/create-faq";
import { FaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export const makeCreateFaq = (): CreateFaqProtocol => {
  const repository = new FaqRepository();
  return new CreateFaq(repository);
};
