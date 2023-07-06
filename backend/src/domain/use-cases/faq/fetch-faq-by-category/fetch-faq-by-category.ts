import { Either, right } from "../../../../shared/Either";
import { FaqRepositoryProtocol } from "../../_data/repositories/faq-repository";
import { FetchFaqByCategoryDTO } from "./ports/fetch-faq-by-category";

export class FetchFaqByCategory implements FetchFaqByCategory {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    this.faqRepository = faqRepository;
  }
  async fetch(
    request: FetchFaqByCategoryDTO.params
  ): Promise<Either<Error, FetchFaqByCategoryDTO.result>> {
    const faqs = await this.faqRepository.loadByCategory(request.id_category);
    return right(faqs);
  }
}
