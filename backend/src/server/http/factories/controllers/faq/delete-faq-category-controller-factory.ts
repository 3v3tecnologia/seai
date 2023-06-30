import { DeleteFaqCategoryController } from "../../../../../presentation/controllers/faq-controller/delete-category.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeDeleteFaqCategory } from "../../use-cases/faq/delete-faq-category";

export const makeDeleteFaqCategoryController = (): Controller => {
  return makeLogControllerDecorator(
    new DeleteFaqCategoryController(makeDeleteFaqCategory())
  );
};
