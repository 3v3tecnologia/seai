import { Controller } from "../../../shared/ports/controllers";
import { FaqUseCasesFactory } from "../services";
import { CreateFaqCategoryController } from "./create-category.controller";
import { CreateFaqController } from "./create.controller";
import { DeleteFaqCategoryController } from "./delete-category.controller";
import { DeleteFaqController } from "./delete.controller";
import { FetchFaqByIdController } from "./fetch-by-id.controller";
import { FetchFaqCategoriesController } from "./fetch-categories.controller";
import { FetchFaqWithCategoriesController } from "./fetch-with-categories.controller";
import {
  createFaqCategoryValidator,
  deleteFaqCategoryValidator,
  updateFaqCategoryValidator,
} from "./schemas/category-validator";
import {
  createFaqValidator,
  deleteFaqValidator,
  updateFaqValidator,
} from "./schemas/faq-validator";
import { UpdateFaqCategoryController } from "./update-faq-category.controller";
import { UpdateFaqController } from "./update.controller";

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
