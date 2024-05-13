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

  static makeFetchFaqsWithCategory(): Controller {
    return makeLogControllerDecorator(
      new FetchFaqWithCategoriesController(
        FaqUseCasesFactory.makeFetchFaqsWithCategories()
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
        FaqUseCasesFactory.makeFetchFaqCategories()
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
