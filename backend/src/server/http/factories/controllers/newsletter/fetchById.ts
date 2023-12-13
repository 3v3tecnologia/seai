import { FetchNewsByIdController } from "../../../../../presentation/controllers/newsletter";
import { makeFetchByIdNewsletter } from "../../use-cases/newsletter";

export const makeFetchByIdNewsletterController =
  (): FetchNewsByIdController => {
    return new FetchNewsByIdController(makeFetchByIdNewsletter());
  };
