import { DeleteNewsController } from "../../../../../presentation/controllers/newsletter";
import { makeDeleteNewsletter } from "../../use-cases/newsletter";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeDeleteNewsletterController = (): DeleteNewsController => {
  return new DeleteNewsController(
    makeDeleteNewsletter(),
    makeRegisterUserLogs()
  );
};
