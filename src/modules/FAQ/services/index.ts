import { DbFaqRepository } from "../infra/repository/faq-repository";
import { CreateFaqCategory } from "./create-category";
import { CreateFaq } from "./create-faq";
import { DeleteFaq } from "./delete-faq";
import { DeleteFaqCategory } from "./delete-faq-category";
import { GetFaqs } from "./fetch-all-faq";
import { FetchFaqById } from "./fetch-faq-by-id";
import { FetchFaqCategories } from "./fetch-faq-categories";
import { GetFaqsUseCaseProtocol } from "./protocols/fetch-all-faq";
import { FetchFaqByIdProtocol } from "./protocols/fetch-faq-by-id";
import { FetchFaqCategoriesProtocol } from "./protocols/fetch-faq-categories";
import { UpdateFaq } from "./update-faq";
import { UpdateFaqCategory } from "./update-faq-category";

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
  static makeFetchFaqCategories(): FetchFaqCategoriesProtocol {
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
