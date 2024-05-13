import { Either, right } from "../../../shared/Either";
import { FaqRepositoryProtocol } from "../_ports/repositories/faq-repository";
import { FetchFaqByIdDTO, FetchFaqByIdProtocol } from "./protocols/fetch-faq-by-id";

export class FetchFaqById implements FetchFaqByIdProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    this.faqRepository = faqRepository;
  }
  async execute(
    request: FetchFaqByIdDTO.params
  ): Promise<Either<Error, FetchFaqByIdDTO.result | null>> {
    const faq = await this.faqRepository.getFaqById(request.id_faq);
    return right(faq);
  }
}
