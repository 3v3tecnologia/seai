import { FetchNewsletterSubscribersController } from "../../../../../presentation/controllers/newsletter";
import { makeFetchNewsletterSubscribersUseCase } from "../../use-cases/newsletter";

export const makeFetchNewsletterSubscribersController =
  (): FetchNewsletterSubscribersController => {
    return new FetchNewsletterSubscribersController(
      makeFetchNewsletterSubscribersUseCase()
    );
  };
