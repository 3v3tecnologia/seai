import {
  CreateFaq,
  CreateFaqCategory,
  DeleteFaq,
  DeleteFaqCategory,
  FetchFaqById,
  FetchFaqCategories,
  GetFaqs,
  UpdateFaq,
  UpdateFaqCategory,
} from "../../../../domain/use-cases/faq";
import { GetFaqsUseCaseProtocol } from "../../../../domain/use-cases/faq/fetch-all-faq/protocol";
import { FetchFaqByIdProtocol } from "../../../../domain/use-cases/faq/fetch-faq-by-id/ports/fetch-faq-by-id";
import { FetchFaqCategoriesProtocol } from "../../../../domain/use-cases/faq/fetch-faq-categories/ports/fetch-faq-categories";
import { DbFaqRepository } from "../../../../infra/database/postgres/repositories/faq-repository";

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
  static makeFetchFaqById(): FetchFaqByIdProtocol {
    return new FetchFaqById(this.repository);
  }
  static makeFetchFaqByCategories(): FetchFaqCategoriesProtocol {
    return new FetchFaqCategories(this.repository);
  }
  static makeFetchFaqsWithCategories(): GetFaqsUseCaseProtocol.UseCase {
    return new GetFaqs(this.repository);
  }
  static makeUpdateFaqCategory(): UpdateFaqCategory {
    return new UpdateFaqCategory(this.repository);
  }
  static makeUpdateFaq(): UpdateFaq {
    return new UpdateFaq(this.repository);
  }
}
