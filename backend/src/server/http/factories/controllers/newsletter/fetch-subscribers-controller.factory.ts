import { FetchNewsletterSubscribersController } from "../../../../../presentation/controllers/newsletter";
import { makeFetchNewsletterSubscribersUseCase } from "../../use-cases/newsletter";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeFetchNewsletterSubscribersController =
  (): FetchNewsletterSubscribersController => {
    return new FetchNewsletterSubscribersController(
      makeFetchNewsletterSubscribersUseCase(),
      makeRegisterUserLogs()
    );
  };
