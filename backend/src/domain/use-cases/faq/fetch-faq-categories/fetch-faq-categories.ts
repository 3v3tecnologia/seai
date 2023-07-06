import { Either, right } from "../../../../shared/Either";
import { FaqRepositoryProtocol } from "../../_data/repositories/faq-repository";

import {
  FetchFaqCategoriesDTO,
  FetchFaqCategoriesProtocol,
} from "./ports/fetch-faq-categories";

export class FetchFaqCategories implements FetchFaqCategoriesProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    this.faqRepository = faqRepository;
  }
  async fetch(): Promise<Either<Error, FetchFaqCategoriesDTO.result>> {
    const categories = await this.faqRepository.loadCategories();
    return right(categories);
  }
}
