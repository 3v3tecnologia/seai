import { env } from "process";

import {
  CreateNews,
  DeleteNews,
  DeleteNewsletterSubscriber,
  FetchAllNews,
  FetchByIdNews,
  FetchOnlySentNews,
  FetchSubscribers,
  FetchSubscribersEmails,
  SubscribeToNews,
  UpdateNews,
  UpdateSendAtNews,
} from "../";

import { BcryptAdapter } from "../../../../infra/cryptography/bcrypt-adapter";
import { QueueProvider } from "../../../../infra/queueProvider/queue.provider";
import { DbNewsLetterContentRepository } from "../../infra/database/repository/newsletter-content-repository";
import { DbNewsLetterSubscriberRepository } from "../../infra/database/repository/newsletter-subscriber-repository";
import { ConfirmUnsubscribeByCode } from "../confirm-remove-subscription.service";
import { ConfirmSubscriberByCode } from "../confirm-user-subscription.service";

export class NewsletterUseCasesFactory {
  private static repository = new DbNewsLetterContentRepository();

  static makeCreateNewsletterController(): CreateNews {
    return new CreateNews(this.repository, new QueueProvider());
  }

  static makeDeleteNewsletter(): DeleteNews {
    return new DeleteNews(
      this.repository,
      new QueueProvider()
    );
  }

  static makeFetchAllNewsletter(): FetchAllNews {
    return new FetchAllNews(this.repository);
  }

  static makeFetchOnlySentNewsletter(): FetchOnlySentNews {
    return new FetchOnlySentNews(this.repository);
  }

  static makeFetchByIdNewsletter(): FetchByIdNews {
    return new FetchByIdNews(this.repository);
  }

  static makeUpdateNewsletter(): UpdateNews {
    return new UpdateNews(
      this.repository,
      new QueueProvider()
    );
  }
  static makeUpdateSendAt(): UpdateSendAtNews {
    return new UpdateSendAtNews(this.repository);
  }
}

export class NewsletterSubscriberUseCasesFactory {
  private static repository = new DbNewsLetterSubscriberRepository();

  static makeSubscribeToNewsletter(): SubscribeToNews {
    return new SubscribeToNews(
      this.repository,
      new QueueProvider(),
      new BcryptAdapter(env.hashSalt)
    );
  }

  static makeConfirmUnsubscribeToNewsletter(): ConfirmUnsubscribeByCode {
    return new ConfirmUnsubscribeByCode(this.repository);
  }

  static makeConfirmSubscribeToNewsletter(): ConfirmSubscriberByCode {
    return new ConfirmSubscriberByCode(this.repository);
  }

  static makeDeleteNewsletterSubscriber(): DeleteNewsletterSubscriber {
    return new DeleteNewsletterSubscriber(this.repository);
  }

  static makeFetchNewsletterSubscribers(): FetchSubscribers {
    return new FetchSubscribers(this.repository);
  }

  static makeFetchNewsletterSubscribersEmails(): FetchSubscribersEmails {
    return new FetchSubscribersEmails(this.repository);
  }
}
