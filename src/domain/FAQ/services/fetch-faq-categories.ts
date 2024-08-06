import { Either, right } from "../../../shared/Either";
import { FaqRepositoryProtocol } from "../infra/repository/protocol/faq-repository";
import {
  FetchFaqCategoriesDTO,
  FetchFaqCategoriesProtocol,
} from "./protocols/fetch-faq-categories";

export class FetchFaqCategories implements FetchFaqCategoriesProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    this.faqRepository = faqRepository;
  }
  async execute(): Promise<Either<Error, FetchFaqCategoriesDTO.result>> {
    return right(await this.faqRepository.getCategories());
  }
}
