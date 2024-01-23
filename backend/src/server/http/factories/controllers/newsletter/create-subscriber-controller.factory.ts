import { SubscribeToNewsController } from "../../../../../presentation/controllers/newsletter";
import { makeSubscribeToNewsletterUseCase } from "../../use-cases/newsletter";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeCreateNewsletterSubscriberController =
  (): SubscribeToNewsController => {
    return new SubscribeToNewsController(
      makeSubscribeToNewsletterUseCase(),
      makeRegisterUserLogs()
    );
  };
