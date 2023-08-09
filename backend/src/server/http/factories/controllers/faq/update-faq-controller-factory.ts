import { UpdateFaqController } from "../../../../../presentation/controllers/faq-controller/update.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeUpdateFaq } from "../../use-cases/faq/update-faq-factory";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeUpdateFaqController = (): Controller => {
  return makeLogControllerDecorator(
    new UpdateFaqController(makeUpdateFaq(), makeRegisterUserLogs())
  );
};
