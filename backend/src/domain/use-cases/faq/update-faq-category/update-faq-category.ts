import { Either, left, right } from "../../../../shared/Either";
import { FaqRepositoryProtocol } from "../../_data/repositories/faq-repository";
import {
  UpdateFaqCategoryDTO,
  UpdateFaqCategoryProtocol,
} from "./ports/update-faq-category";
import { UpdateFaqCategoryErrors } from "./update-faq-category-errors";

export class UpdateFaqCategory implements UpdateFaqCategoryProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    this.faqRepository = faqRepository;
  }
  async update(
    request: UpdateFaqCategoryDTO.params
  ): Promise<Either<Error, UpdateFaqCategoryDTO.result>> {
    const exists = await this.faqRepository.loadCategoryById(request.id);

    if (!exists) {
      return left(new UpdateFaqCategoryErrors.CategoryNotExists());
    }
    await this.faqRepository.updateCategory(
      request.id,
      request.title,
      request.description
    );
    return right("Categoria atualizada sucesso");
  }
}
