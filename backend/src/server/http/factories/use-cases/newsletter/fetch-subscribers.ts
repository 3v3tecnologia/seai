import { FetchSubscribers } from "../../../../../domain/use-cases/newsletter";
import { DbNewsLetterSubscriberRepository } from "../../../../../infra/database/postgres/repositories/newsletter-subscriber-repository";

export const makeFetchNewsletterSubscribersUseCase = (): FetchSubscribers => {
  const accountRepository = new DbNewsLetterSubscriberRepository();
  return new FetchSubscribers(accountRepository);
};
