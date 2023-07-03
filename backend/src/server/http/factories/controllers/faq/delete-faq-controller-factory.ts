import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeDeleteFaq } from "../../use-cases/faq/delete-faq-factory";
import { DeleteFaqController } from "./../../../../../presentation/controllers/faq-controller/delete.controller";

export const makeDeleteFaqController = (): Controller => {
  return makeLogControllerDecorator(new DeleteFaqController(makeDeleteFaq()));
};
