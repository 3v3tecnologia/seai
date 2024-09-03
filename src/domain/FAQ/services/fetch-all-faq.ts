import { Either, right } from "../../../shared/Either";
import { FaqRepositoryProtocol } from "../infra/repository/protocol/faq-repository";
import { GetFaqsUseCaseProtocol } from "./protocols/fetch-all-faq";

export class GetFaqs implements GetFaqsUseCaseProtocol.UseCase {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    this.faqRepository = faqRepository;
  }
  async execute(
    params: GetFaqsUseCaseProtocol.Input
  ): Promise<Either<Error, GetFaqsUseCaseProtocol.Output>> {
    const { limit, offset, pageNumber } = params;

    if (params.id_category) {
      return right(
        await this.faqRepository.getFagsByCategory({
          id_category: params.id_category,
          limit,
          offset,
          pageNumber,
        })
      );
    }

    const { question } = params;

    return right(
      await this.faqRepository.getFaqs({
        limit,
        offset,
        pageNumber,
        question,
      })
    );
  }
}