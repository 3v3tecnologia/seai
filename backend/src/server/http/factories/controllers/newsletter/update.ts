import { UpdateController } from "../../../../../presentation/controllers/newsletter";
import { makeUpdateNewsletter } from "../../use-cases/newsletter";

export const makeUpdateNewsletterController = (): UpdateController => {
  return new UpdateController(makeUpdateNewsletter());
};
