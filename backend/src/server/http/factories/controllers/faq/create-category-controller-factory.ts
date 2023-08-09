import { CreateFaqCategoryController } from "../../../../../presentation/controllers/faq-controller/create-category.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeCreateFaqCategory } from "../../use-cases/faq/create-faq-category-factory";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeCreateFaqCategoryController = (): Controller => {
  return makeLogControllerDecorator(
    new CreateFaqCategoryController(
      makeCreateFaqCategory(),
      makeRegisterUserLogs()
    )
  );
};
