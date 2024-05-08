import { Either, right } from "../../../../shared/Either";
import { FaqRepositoryProtocol } from "../../_ports/repositories/faq-repository";
import { GetFaqsUseCaseProtocol } from "./protocol";

export class GetFaqs implements GetFaqsUseCaseProtocol.UseCase {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    this.faqRepository = faqRepository;
  }
  async execute(
    params: GetFaqsUseCaseProtocol.Input
  ): Promise<Either<Error, GetFaqsUseCaseProtocol.Output>> {

    const { limit, offset, pageNumber } = params

    if (params.id_category) {
      return right(await this.faqRepository.loadByCategory({
        id_category: params.id_category,
        limit,
        offset,
        pageNumber
      }));
    }

    const { question } = params

    return right(await this.faqRepository.loadAll({
      limit,
      offset,
      pageNumber,
      question
    }));
  }
}
