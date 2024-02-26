import {
  CreateNews,
  DeleteNews,
  DeleteNewsletterSubscriber,
  FetchAllNews,
  FetchByIdNews,
  FetchSubscribers,
  SubscribeToNews,
  UpdateNews,
} from "../../../../domain/use-cases/newsletter";
import { DbBackgroundJobsRepository } from "../../../../infra/database/postgres/repositories/background-jobs-repository";
import { DbNewsLetterContentRepository } from "../../../../infra/database/postgres/repositories/newsletter-content-repository";
import { DbNewsLetterSubscriberRepository } from "../../../../infra/database/postgres/repositories/newsletter-subscriber-repository";
import { JobsUseCasesFactory } from "./jobs.useCase.factory";

export class NewsletterUseCasesFactory {
  private static repository = new DbNewsLetterContentRepository();

  static makeCreateNewsletterController(): CreateNews {
    return new CreateNews(this.repository, JobsUseCasesFactory.makeCreateJob());
  }

  static makeDeleteNewsletter(): DeleteNews {
    return new DeleteNews(this.repository, JobsUseCasesFactory.makeDeleteJob());
  }

  static makeFetchAllNewsletter(): FetchAllNews {
    return new FetchAllNews(this.repository);
  }

  static makeFetchByIdNewsletter(): FetchByIdNews {
    return new FetchByIdNews(this.repository, new DbBackgroundJobsRepository());
  }

  static makeUpdateNewsletter(): UpdateNews {
    return new UpdateNews(
      this.repository,
      JobsUseCasesFactory.makeCreateJob(),
      JobsUseCasesFactory.makeFetchJob(),
      JobsUseCasesFactory.makeUpdateJob()
    );
  }
}

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
