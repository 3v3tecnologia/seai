import { DeleteNewsletterSubscriberController } from "../../../../../presentation/controllers/newsletter";
import { makeDeleteNewsletterSubscriberUseCase } from "../../use-cases/newsletter";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeDeleteNewsletterSubscriberController =
  (): DeleteNewsletterSubscriberController => {
    return new DeleteNewsletterSubscriberController(
      makeDeleteNewsletterSubscriberUseCase(),
      makeRegisterUserLogs()
    );
  };
