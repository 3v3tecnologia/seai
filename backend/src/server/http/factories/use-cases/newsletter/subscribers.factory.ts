import {
  DeleteNewsletterSubscriber,
  FetchSubscribers,
  SubscribeToNews,
} from "../../../../../domain/use-cases/newsletter";
import { DbNewsLetterSubscriberRepository } from "../../../../../infra/database/postgres/repositories/newsletter-subscriber-repository";

export class NewsletterSubscriberUseCasesFactory {
  private static repository = new DbNewsLetterSubscriberRepository();

  static makeSubscribeToNewsletter(): SubscribeToNews {
    return new SubscribeToNews(this.repository);
  }

  static makeDeleteNewsletterSubscriber(): DeleteNewsletterSubscriber {
    return new DeleteNewsletterSubscriber(this.repository);
  }

  static makeFetchNewsletterSubscribers(): FetchSubscribers {
    return new FetchSubscribers(this.repository);
  }
}
