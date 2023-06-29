import { FaqRepository } from "../../../../infra/database/postgres/repositories/faq-repository";
import { Either, right } from "../../../../shared/Either";
import { FetchFaqCategoriesProtocol } from "./ports/fetch-faq-categories";

export class FetchFaqCategories implements FetchFaqCategoriesProtocol {
  private readonly faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.faqRepository = faqRepository;
  }
  async fetch(): Promise<Either<Error, Array<any> | null>> {
    const categories = await this.faqRepository.loadCategories();
    return right(categories);
  }
}
