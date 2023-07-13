import { CreateFaqController } from "../../../../../presentation/controllers/faq-controller/create.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeCreateFaq } from "../../use-cases/faq/create-faq-factory";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeCreateFaqController = (): Controller => {
  return makeLogControllerDecorator(
    new CreateFaqController(makeCreateFaq(), makeRegisterUserLogs())
  );
};
