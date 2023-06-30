import { FetchFaqByCategoryController } from "../../../../../presentation/controllers/faq-controller/fetch-by-category.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchFaqByCategory } from "../../use-cases/faq/fetch-faq-by-category-factory";

export const makeFetchFaqByCategoryController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchFaqByCategoryController(makeFetchFaqByCategory())
  );
};
