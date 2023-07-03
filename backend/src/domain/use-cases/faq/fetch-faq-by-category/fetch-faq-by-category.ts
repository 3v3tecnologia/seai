import { Either, right } from "../../../../shared/Either";
import { FaqRepository } from "../../../ports/db/faq/faq-repository";
import { FetchFaqByCategoryDTO } from "./ports/fetch-faq-by-category";

export class FetchFaqByCategory implements FetchFaqByCategory {
  private readonly faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.faqRepository = faqRepository;
  }
  async fetch(
    request: FetchFaqByCategoryDTO.params
  ): Promise<Either<Error, Array<any> | null>> {
    const faqs = await this.faqRepository.loadByCategory(request.id_category);
    return right(faqs);
  }
}
