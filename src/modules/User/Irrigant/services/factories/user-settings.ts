import { NewsletterSubscriberUseCasesFactory } from "../../../../../server/http/factories";
import { UserRepository } from "../../../Government/infra/database/repository/user-repository";
import { IrrigantPreferencesRepository } from "../../infra/repositories/user-preferences.repository";
import { UserSettingsServices } from "../user-settings.service";

export const makeUserSettingsService = () =>
  new UserSettingsServices(
    new IrrigantPreferencesRepository(),
    new UserRepository(),
    NewsletterSubscriberUseCasesFactory.makeSubscribeToNewsletter(),
    NewsletterSubscriberUseCasesFactory.makeDeleteNewsletterSubscriber()
  );
