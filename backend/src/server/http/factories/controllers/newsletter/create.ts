import { CreateNewsController } from "../../../../../presentation/controllers/newsletter";
import { makeCreateNewsletterController } from "../../use-cases/newsletter";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeCreateNewsletter = (): CreateNewsController => {
  return new CreateNewsController(
    makeCreateNewsletterController(),
    makeRegisterUserLogs()
  );
};
