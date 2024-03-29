import {
  CreateNewsController,
  DeleteNewsController,
  DeleteNewsletterSubscriberController,
  FetchNewsByIdController,
  FetchNewsController,
  FetchNewsletterSubscribersController,
  SubscribeToNewsController,
  UpdateController,
} from "../../../../presentation/controllers/newsletter";
import {
  NewsletterSubscriberUseCasesFactory,
  NewsletterUseCasesFactory,
  SystemLogsUseCaseFactory,
} from "../use-cases";

export class NewsletterControllersFactory {
  static makeCreateNewsletterSubscriber(): SubscribeToNewsController {
    return new SubscribeToNewsController(
      NewsletterSubscriberUseCasesFactory.makeSubscribeToNewsletter(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }

  static makeCreateNewsletter(): CreateNewsController {
    return new CreateNewsController(
      NewsletterUseCasesFactory.makeCreateNewsletterController(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }

  static makeDeleteNewsletterSubscriber(): DeleteNewsletterSubscriberController {
    return new DeleteNewsletterSubscriberController(
      NewsletterSubscriberUseCasesFactory.makeDeleteNewsletterSubscriber(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }

  static makeDeleteNewsletter(): DeleteNewsController {
    return new DeleteNewsController(
      NewsletterUseCasesFactory.makeDeleteNewsletter(),
      SystemLogsUseCaseFactory.makeRegisterUserLogs()
    );
  }

  static makeFetchNewsletterSubscribers(): FetchNewsletterSubscribersController {
    return new FetchNewsletterSubscribersController(
      NewsletterSubscriberUseCasesFactory.makeFetchNewsletterSubscribers()
    );
  }

  static makeFetchAllNewsletter(): FetchNewsController {
    return new FetchNewsController(
      NewsletterUseCasesFactory.makeFetchAllNewsletter()
    );
  }

  static makeFetchByIdNewsletter(): FetchNewsByIdController {
    return new FetchNewsByIdController(
      NewsletterUseCasesFactory.makeFetchByIdNewsletter()
    );
  }

  static makeUpdateNewsletter(): UpdateController {
    return new UpdateController(
      NewsletterUseCasesFactory.makeUpdateNewsletter()
    );
  }
}
