import { FetchFaqWithCategoriesController } from "../../../../../presentation/controllers/faq-controller/fetch-with-categories.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchFaqsWithCategories } from "../../use-cases/faq/fetch-faq-with-categories-factory";

export const makeFetchFaqsWithCategoryController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchFaqWithCategoriesController(makeFetchFaqsWithCategories())
  );
};
