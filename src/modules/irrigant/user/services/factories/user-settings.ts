import { DbAccountRepository } from "../../../../../infra/database/postgres/repositories/users-repository";
import { NewsletterSubscriberUseCasesFactory } from "../../../../../server/http/factories";
import { IrrigantPreferencesRepository } from "../../repositories/user-preferences.repository";
import { UserSettingsServices } from "../user-settings.service";

export const makeUserSettingsService = () =>
  new UserSettingsServices(
    new IrrigantPreferencesRepository(),
    new DbAccountRepository(),
    NewsletterSubscriberUseCasesFactory.makeSubscribeToNewsletter(),
    NewsletterSubscriberUseCasesFactory.makeDeleteNewsletterSubscriber()
  );
