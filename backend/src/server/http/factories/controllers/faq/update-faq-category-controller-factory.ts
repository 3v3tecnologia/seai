import { UpdateFaqCategoryController } from "../../../../../presentation/controllers/faq-controller/update-faq-category.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeUpdateFaqCategory } from "../../use-cases/faq/update-faq-category-factory";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeUpdateFaqCategoryController = (): Controller => {
  return makeLogControllerDecorator(
    new UpdateFaqCategoryController(
      makeUpdateFaqCategory(),
      makeRegisterUserLogs()
    )
  );
};
