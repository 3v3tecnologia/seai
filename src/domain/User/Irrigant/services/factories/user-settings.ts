import { NewsletterSubscriberUseCasesFactory } from "../../../../Newsletter/services/factory/newsletter.useCase.factory";
import { IrrigationUserRepository } from "../../infra/repositories/irrigation-user.repository";
import { IrrigantPreferencesRepository } from "../../infra/repositories/user-preferences.repository";
import { UserSettingsServices } from "../user-settings.service";

export const makeUserSettingsService = () =>
  new UserSettingsServices(
    new IrrigantPreferencesRepository(),
    new IrrigationUserRepository(),
    NewsletterSubscriberUseCasesFactory.makeSubscribeToNewsletter(),
    NewsletterSubscriberUseCasesFactory.makeDeleteNewsletterSubscriber()
  );
