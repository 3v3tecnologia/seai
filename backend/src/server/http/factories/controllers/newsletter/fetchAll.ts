import { FetchNewsController } from "../../../../../presentation/controllers/newsletter";
import { makeFetchAllNewsletter } from "../../use-cases/newsletter";

export const makeFetchAllNewsletterController = (): FetchNewsController => {
  return new FetchNewsController(makeFetchAllNewsletter());
};
