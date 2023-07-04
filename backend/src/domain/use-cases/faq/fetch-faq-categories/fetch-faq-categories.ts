import { Either, right } from "../../../../shared/Either";
import { FaqRepository } from "../../../ports/db/faq/faq-repository";

import {
  FetchFaqCategoriesDTO,
  FetchFaqCategoriesProtocol,
} from "./ports/fetch-faq-categories";

export class FetchFaqCategories implements FetchFaqCategoriesProtocol {
  private readonly faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.faqRepository = faqRepository;
  }
  async fetch(): Promise<Either<Error, FetchFaqCategoriesDTO.result>> {
    const categories = await this.faqRepository.loadCategories();
    return right(categories);
  }
}
