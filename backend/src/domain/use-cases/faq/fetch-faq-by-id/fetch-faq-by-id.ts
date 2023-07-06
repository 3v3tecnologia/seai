import { Either, right } from "../../../../shared/Either";
import { FaqRepositoryProtocol } from "../../_data/repositories/faq-repository";
import { FetchFaqByIdDTO, FetchFaqByIdProtocol } from "./ports/fetch-faq-by-id";

export class FetchFaqById implements FetchFaqByIdProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    this.faqRepository = faqRepository;
  }
  async fetch(
    request: FetchFaqByIdDTO.params
  ): Promise<Either<Error, FetchFaqByIdDTO.result | null>> {
    const faq = await this.faqRepository.loadById(request.id_faq);
    return right(faq);
  }
}
