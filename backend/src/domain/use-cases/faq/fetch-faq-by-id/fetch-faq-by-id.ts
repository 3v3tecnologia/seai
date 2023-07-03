import { Either, right } from "../../../../shared/Either";
import { FaqRepository } from "../../../ports/db/faq/faq-repository";
import { FetchFaqByIdDTO, FetchFaqByIdProtocol } from "./ports/fetch-faq-by-id";

export class FetchFaqById implements FetchFaqByIdProtocol {
  private readonly faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.faqRepository = faqRepository;
  }
  async fetch(
    request: FetchFaqByIdDTO.params
  ): Promise<Either<Error, FetchFaqByIdDTO.result>> {
    const faq = await this.faqRepository.loadById(request.id_faq);
    return right(faq);
  }
}
