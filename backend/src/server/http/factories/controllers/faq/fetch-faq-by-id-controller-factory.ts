import { FetchFaqByIdController } from "../../../../../presentation/controllers/faq-controller/fetch-by-id.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../../decorators";
import { makeFetchFaqById } from "../../use-cases/faq/fetch-faq-by-id-factory";

export const makeFetchFaqByIdController = (): Controller => {
  return makeLogControllerDecorator(
    new FetchFaqByIdController(makeFetchFaqById())
  );
};
