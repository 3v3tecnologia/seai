import { FaqRepository } from "../../../ports/db/faq/faq-repository";
import { Either, left, right } from "../../../../shared/Either";
import {
  CreateFaqCategoryDTO,
  CreateFaqCategoryProtocol,
} from "./ports/create-faq-category";
import { CreateFaqCategoryErrors } from "./create-faq-category-errors";

export class CreateFaqCategory implements CreateFaqCategoryProtocol {
  private readonly faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.faqRepository = faqRepository;
  }
  async create(
    request: CreateFaqCategoryDTO.params
  ): Promise<Either<Error, CreateFaqCategoryDTO.result>> {
    const alreadyExists = await this.faqRepository.loadCategoryByTitle(
      request.title
    );

    if (alreadyExists) {
      return left(new CreateFaqCategoryErrors.CategoryAlreadyExists());
    }
    await this.faqRepository.addCategory(request.title, request.description);
    return right("Categoria criada com sucesso");
  }
}
