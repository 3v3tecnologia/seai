import { Either, right } from "../../../../shared/Either";
import { FaqRepository } from "../../../ports/db/faq/faq-repository";
import {
  FetchFaqWithCategoriesDTO,
  FetchFaqWithCategoriesProtocol,
} from "./ports/fetch-faq-with-categories";

export class FetchFaqWithCategories implements FetchFaqWithCategoriesProtocol {
  private readonly faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.faqRepository = faqRepository;
  }
  async fetch(): Promise<
    Either<Error, Array<FetchFaqWithCategoriesDTO.result> | null>
  > {
    const categories = await this.faqRepository.loadAll();
    return right(categories);
  }
}
