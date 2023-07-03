import { FetchFaqCategoriesController } from "../../../../../presentation/controllers/faq-controller/fetch-categories.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchFaqByCategories } from "../../use-cases/faq/fetch-faq-categories-factory";

export const makeFetchFaqCategoriesController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchFaqCategoriesController(makeFetchFaqByCategories())
  );
};
