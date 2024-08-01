import {
  CreateFaqCategoryController,
  CreateFaqController,
  DeleteFaqCategoryController,
  DeleteFaqController,
  FetchFaqByIdController,
  FetchFaqCategoriesController,
  FetchFaqWithCategoriesController,
  UpdateFaqCategoryController,
  UpdateFaqController,
} from "../../../../presentation/controllers/faq";
import {
  createFaqCategoryValidator,
  deleteFaqCategoryValidator,
  updateFaqCategoryValidator,
} from "../../../../presentation/controllers/faq/schemas/category-validator";
import {
  createFaqValidator,
  deleteFaqValidator,
  updateFaqValidator,
} from "../../../../presentation/controllers/faq/schemas/faq-validator";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { FaqUseCasesFactory } from "../use-cases";

export class FaqControllersFactory {
  static makeCreateFaqCategory(): Controller {
    return new CreateFaqCategoryController(
      FaqUseCasesFactory.makeCreateFaqCategory(),
      createFaqCategoryValidator
    );
  }
  static makeCreateFaq(): Controller {
    return new CreateFaqController(
      FaqUseCasesFactory.makeCreateFaq(),
      createFaqValidator
    );
  }
  static makeDeleteFaqCategory(): Controller {
    return new DeleteFaqCategoryController(
      FaqUseCasesFactory.makeDeleteFaqCategory(),
      deleteFaqCategoryValidator
    );
  }
  static makeDeleteFaq(): Controller {
    return new DeleteFaqController(
      FaqUseCasesFactory.makeDeleteFaq(),
      deleteFaqValidator
    );
  }

  static makeFetchFaqsWithCategory(): Controller {
    return new FetchFaqWithCategoriesController(
      FaqUseCasesFactory.makeFetchFaqsWithCategories()
    );
  }
  static makeFetchFaqById(): Controller {
    return new FetchFaqByIdController(FaqUseCasesFactory.makeFetchFaqById());
  }
  static makeFetchFaqCategories(): Controller {
    return new FetchFaqCategoriesController(
      FaqUseCasesFactory.makeFetchFaqCategories()
    );
  }
  static makeUpdateFaqCategory(): Controller {
    return new UpdateFaqCategoryController(
      FaqUseCasesFactory.makeUpdateFaqCategory(),
      updateFaqCategoryValidator
    );
  }
  static makeUpdateFaq(): Controller {
    return new UpdateFaqController(
      FaqUseCasesFactory.makeUpdateFaq(),
      updateFaqValidator
    );
  }
}
