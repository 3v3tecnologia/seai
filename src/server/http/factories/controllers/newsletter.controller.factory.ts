import {
  CreateNewsController,
  DeleteNewsController,
  DeleteNewsletterSubscriberController,
  FetchNewsByIdController,
  FetchNewsController,
  FetchNewsletterSubscribersController,
  FetchNewsletterSubscribersEmailsController,
  FetchOnlySentNewsController,
  SubscribeToNewsController,
  UpdateController,
  UpdateSendAtController,
} from "../../../../presentation/controllers/newsletter";
import newsletterValidator from "../../../../presentation/controllers/newsletter/schema/newsletter-validator";
import subscriberValidator from "../../../../presentation/controllers/newsletter/schema/subscriber-validator";
import {
  NewsletterSubscriberUseCasesFactory,
  NewsletterUseCasesFactory,
  SystemLogsUseCaseFactory,
} from "../use-cases";


export class NewsletterControllersFactory {
  static makeCreateNewsletterSubscriber(): SubscribeToNewsController {
    return new SubscribeToNewsController(
      NewsletterSubscriberUseCasesFactory.makeSubscribeToNewsletter(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs(),
      subscriberValidator.subscribe
    );
  }

  static makeCreateNewsletter(): CreateNewsController {
    return new CreateNewsController(
      NewsletterUseCasesFactory.makeCreateNewsletterController(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs(),
      newsletterValidator.createNews
    );
  }

  static makeDeleteNewsletterSubscriber(): DeleteNewsletterSubscriberController {
    return new DeleteNewsletterSubscriberController(
      NewsletterSubscriberUseCasesFactory.makeDeleteNewsletterSubscriber(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs(),
      subscriberValidator.unsubscribe
    );
  }

  static makeDeleteNewsletter(): DeleteNewsController {
    return new DeleteNewsController(
      NewsletterUseCasesFactory.makeDeleteNewsletter(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs(),
      newsletterValidator.deleteNews
    );
  }

  static makeFetchNewsletterSubscribers(): FetchNewsletterSubscribersController {
    return new FetchNewsletterSubscribersController(
      NewsletterSubscriberUseCasesFactory.makeFetchNewsletterSubscribers(),
      subscriberValidator.fetchNews
    );
  }
  static makeFetchNewsletterSubscribersEmails(): FetchNewsletterSubscribersEmailsController {
    return new FetchNewsletterSubscribersEmailsController(
      NewsletterSubscriberUseCasesFactory.makeFetchNewsletterSubscribersEmails()
    );
  }

  static makeFetchAllNewsletter(): FetchNewsController {
    return new FetchNewsController(
      NewsletterUseCasesFactory.makeFetchAllNewsletter(),
      newsletterValidator.fetchNews
    );
  }

  static makeFetchOnlySentNewsletter(): FetchOnlySentNewsController {
    return new FetchOnlySentNewsController(
      NewsletterUseCasesFactory.makeFetchOnlySentNewsletter(),
      newsletterValidator.fetchOnlySent
    );
  }

  static makeFetchByIdNewsletter(): FetchNewsByIdController {
    return new FetchNewsByIdController(
      NewsletterUseCasesFactory.makeFetchByIdNewsletter(),
      newsletterValidator.fetchNewsById
    );
  }

  static makeUpdateNewsletter(): UpdateController {
    return new UpdateController(
      NewsletterUseCasesFactory.makeUpdateNewsletter(),
      newsletterValidator.updateNews
    );
  }

  static makeUpdateSendAt(): UpdateSendAtController {
    return new UpdateSendAtController(
      NewsletterUseCasesFactory.makeUpdateSendAt(),
      newsletterValidator.updateSendAt
    );
  }
}
