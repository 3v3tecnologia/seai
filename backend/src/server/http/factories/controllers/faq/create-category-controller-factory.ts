import { CreateFaqCategoryController } from "../../../../../presentation/controllers/faq-controller/create-category.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeCreateFaqCategory } from "../../use-cases/faq/create-faq-category-factory";

export const makeCreateFaqCategoryController = (): Controller => {
  return makeLogControllerDecorator(
    new CreateFaqCategoryController(makeCreateFaqCategory())
  );
};
