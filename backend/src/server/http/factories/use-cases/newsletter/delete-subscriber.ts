import { DeleteNewsletterSubscriber } from "../../../../../domain/use-cases/newsletter";
import { DbNewsLetterSubscriberRepository } from "../../../../../infra/database/postgres/repositories/newsletter-subscriber-repository";

export const makeDeleteNewsletterSubscriberUseCase =
  (): DeleteNewsletterSubscriber => {
    const accountRepository = new DbNewsLetterSubscriberRepository();
    return new DeleteNewsletterSubscriber(accountRepository);
  };
