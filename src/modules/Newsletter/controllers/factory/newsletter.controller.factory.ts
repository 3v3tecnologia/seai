import {
  ConfirmSubscriberByCodeController,
  ConfirmUnsubscribeByCodeController,
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
} from "../";
import newsletterValidator from "../schema/newsletter-validator";
import subscriberValidator from "../schema/subscriber-validator";
import {
  NewsletterSubscriberUseCasesFactory,
  NewsletterUseCasesFactory,
} from "../../services/factory/newsletter.useCase.factory";

export class NewsletterControllersFactory {
  static makeCreateNewsletterSubscriber(): SubscribeToNewsController {
    return new SubscribeToNewsController(
      NewsletterSubscriberUseCasesFactory.makeSubscribeToNewsletter(),
      subscriberValidator.subscribe
    );
  }

  static makeConfirmSubscriberByCode(): ConfirmSubscriberByCodeController {
    return new ConfirmSubscriberByCodeController(
      NewsletterSubscriberUseCasesFactory.makeConfirmSubscribeToNewsletter(),
      subscriberValidator.subscribe
    );
  }

  static makeConfirmUnsubscribeByCode(): ConfirmUnsubscribeByCodeController {
    return new ConfirmUnsubscribeByCodeController(
      NewsletterSubscriberUseCasesFactory.makeConfirmUnsubscribeToNewsletter(),
      subscriberValidator.subscribe
    );
  }

  static makeCreateNewsletter(): CreateNewsController {
    return new CreateNewsController(
      NewsletterUseCasesFactory.makeCreateNewsletterController(),
      newsletterValidator.createNews
    );
  }

  static makeDeleteNewsletterSubscriber(): DeleteNewsletterSubscriberController {
    return new DeleteNewsletterSubscriberController(
      NewsletterSubscriberUseCasesFactory.makeDeleteNewsletterSubscriber(),
      subscriberValidator.unsubscribe
    );
  }

  static makeDeleteNewsletter(): DeleteNewsController {
    return new DeleteNewsController(
      NewsletterUseCasesFactory.makeDeleteNewsletter(),
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
