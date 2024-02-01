import {
  CreateFaq,
  CreateFaqCategory,
  DeleteFaq,
  DeleteFaqCategory,
  FetchFaqByCategory,
  FetchFaqById,
  FetchFaqCategories,
  FetchFaqWithCategories,
  UpdateFaq,
  UpdateFaqCategory,
} from "../../../../../domain/use-cases/faq";
import { FetchFaqByCategoryProtocol } from "../../../../../domain/use-cases/faq/fetch-faq-by-category/ports/fetch-faq-by-category";
import { FetchFaqByIdProtocol } from "../../../../../domain/use-cases/faq/fetch-faq-by-id/ports/fetch-faq-by-id";
import { FetchFaqCategoriesProtocol } from "../../../../../domain/use-cases/faq/fetch-faq-categories/ports/fetch-faq-categories";
import { FetchFaqWithCategoriesProtocol } from "../../../../../domain/use-cases/faq/fetch-faq-with-categories/ports/fetch-faq-with-categories";
import { DbFaqRepository } from "../../../../../infra/database/postgres/repositories/faq-repository";

export class FaqUseCasesFactory {
  private static repository = new DbFaqRepository();

  static makeCreateFaqCategory(): CreateFaqCategory {
    return new CreateFaqCategory(this.repository);
  }
  static makeCreateFaq(): CreateFaq {
    return new CreateFaq(this.repository);
  }
  static makeDeleteFaqCategory(): DeleteFaqCategory {
    return new DeleteFaqCategory(this.repository);
  }
  static makeDeleteFaq(): DeleteFaq {
    return new DeleteFaq(this.repository);
  }
  static makeFetchFaqByCategory(): FetchFaqByCategoryProtocol {
    return new FetchFaqByCategory(this.repository);
  }
  static makeFetchFaqById(): FetchFaqByIdProtocol {
    return new FetchFaqById(this.repository);
  }
  static makeFetchFaqByCategories(): FetchFaqCategoriesProtocol {
    return new FetchFaqCategories(this.repository);
  }
  static makeFetchFaqsWithCategories(): FetchFaqWithCategoriesProtocol {
    return new FetchFaqWithCategories(this.repository);
  }
  static makeUpdateFaqCategory(): UpdateFaqCategory {
    return new UpdateFaqCategory(this.repository);
  }
  static makeUpdateFaq(): UpdateFaq {
    return new UpdateFaq(this.repository);
  }
}
