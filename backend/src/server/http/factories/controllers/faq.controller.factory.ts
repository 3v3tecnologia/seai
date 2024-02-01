import { CreateFaqCategoryController } from "../../../../presentation/controllers/faq-controller/create-category.controller";
import { CreateFaqController } from "../../../../presentation/controllers/faq-controller/create.controller";
import { DeleteFaqCategoryController } from "../../../../presentation/controllers/faq-controller/delete-category.controller";
import { DeleteFaqController } from "../../../../presentation/controllers/faq-controller/delete.controller";
import { FetchFaqByCategoryController } from "../../../../presentation/controllers/faq-controller/fetch-by-category.controller";
import { FetchFaqByIdController } from "../../../../presentation/controllers/faq-controller/fetch-by-id.controller";
import { FetchFaqCategoriesController } from "../../../../presentation/controllers/faq-controller/fetch-categories.controller";
import { FetchFaqWithCategoriesController } from "../../../../presentation/controllers/faq-controller/fetch-with-categories.controller";
import { UpdateFaqCategoryController } from "../../../../presentation/controllers/faq-controller/update-faq-category.controller";
import { UpdateFaqController } from "../../../../presentation/controllers/faq-controller/update.controller";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../decorators";
import { FaqUseCasesFactory, SystemLogsUseCaseFactory } from "../use-cases";

export class FaqControllersFactory {
  static makeCreateFaqCategory(): Controller {
    return makeLogControllerDecorator(
      new CreateFaqCategoryController(
        FaqUseCasesFactory.makeCreateFaqCategory(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }
  static makeCreateFaq(): Controller {
    return makeLogControllerDecorator(
      new CreateFaqController(
        FaqUseCasesFactory.makeCreateFaq(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }
  static makeDeleteFaqCategory(): Controller {
    return makeLogControllerDecorator(
      new DeleteFaqCategoryController(
        FaqUseCasesFactory.makeDeleteFaqCategory(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }
  static makeDeleteFaq(): Controller {
    return makeLogControllerDecorator(
      new DeleteFaqController(
        FaqUseCasesFactory.makeDeleteFaq(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }
  static makeFetchFaqByCategory(): Controller {
    return makeLogControllerDecorator(
      new FetchFaqByCategoryController(
        FaqUseCasesFactory.makeFetchFaqByCategory()
      )
    );
  }
  static makeFetchFaqById(): Controller {
    return makeLogControllerDecorator(
      new FetchFaqByIdController(FaqUseCasesFactory.makeFetchFaqById())
    );
  }
  static makeFetchFaqCategories(): Controller {
    return makeLogControllerDecorator(
      new FetchFaqCategoriesController(
        FaqUseCasesFactory.makeFetchFaqByCategories()
      )
    );
  }
  static makeFetchFaqsWithCategory(): Controller {
    return makeLogControllerDecorator(
      new FetchFaqWithCategoriesController(
        FaqUseCasesFactory.makeFetchFaqsWithCategories()
      )
    );
  }
  static makeUpdateFaqCategory(): Controller {
    return makeLogControllerDecorator(
      new UpdateFaqCategoryController(
        FaqUseCasesFactory.makeUpdateFaqCategory(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }
  static makeUpdateFaq(): Controller {
    return makeLogControllerDecorator(
      new UpdateFaqController(
        FaqUseCasesFactory.makeUpdateFaq(),
        SystemLogsUseCaseFactory.makeRegisterUserLogs()
      )
    );
  }
}
