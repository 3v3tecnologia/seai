import { FaqRepository } from "../../../ports/db/faq/faq-repository";
import { Either, right } from "../../../../shared/Either";
import {
  CreateFaqCategoryDTO,
  CreateFaqCategoryProtocol,
} from "./ports/create-faq-category";

export class CreateFaqCategory implements CreateFaqCategoryProtocol {
  private readonly faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.faqRepository = faqRepository;
  }
  async create(
    request: CreateFaqCategoryDTO.params
  ): Promise<Either<Error, CreateFaqCategoryDTO.result>> {
    await this.faqRepository.addCategory(request.title, request.description);
    return right("Categoria criado com sucesso");
  }
}
