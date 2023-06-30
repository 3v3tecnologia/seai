import { CreateFaqController } from "../../../../../presentation/controllers/faq-controller/create.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeCreateFaq } from "../../use-cases/faq/create-faq-factory";

export const makeCreateFaqController = (): Controller => {
  return makeLogControllerDecorator(new CreateFaqController(makeCreateFaq()));
};
