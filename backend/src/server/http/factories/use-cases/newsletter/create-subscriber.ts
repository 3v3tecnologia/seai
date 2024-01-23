import { SubscribeToNews } from "../../../../../domain/use-cases/newsletter";
import { DbNewsLetterSubscriberRepository } from "../../../../../infra/database/postgres/repositories/newsletter-subscriber-repository";

export const makeSubscribeToNewsletterUseCase = (): SubscribeToNews => {
  const accountRepository = new DbNewsLetterSubscriberRepository();
  return new SubscribeToNews(accountRepository);
};
