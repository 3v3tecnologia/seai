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
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { FaqUseCasesFactory } from "../use-cases";

export class FaqControllersFactory {
  static makeCreateFaqCategory(): Controller {
    return new CreateFaqCategoryController(
      FaqUseCasesFactory.makeCreateFaqCategory()
    );
  }
  static makeCreateFaq(): Controller {
    return new CreateFaqController(FaqUseCasesFactory.makeCreateFaq());
  }
  static makeDeleteFaqCategory(): Controller {
    return new DeleteFaqCategoryController(
      FaqUseCasesFactory.makeDeleteFaqCategory()
    );
  }
  static makeDeleteFaq(): Controller {
    return new DeleteFaqController(FaqUseCasesFactory.makeDeleteFaq());
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
      FaqUseCasesFactory.makeUpdateFaqCategory()
    );
  }
  static makeUpdateFaq(): Controller {
    return new UpdateFaqController(FaqUseCasesFactory.makeUpdateFaq());
  }
}
