import { Either, right } from "../../../../shared/Either";
import { FaqRepository } from "../../../ports/db/faq/faq-repository";
import {
  DeleteFaqCategoryDTO,
  DeleteFaqCategoryProtocol,
} from "./ports/delete-faq-category";

export class DeleteFaqCategory implements DeleteFaqCategoryProtocol {
  private readonly faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.faqRepository = faqRepository;
  }
  async delete(
    request: DeleteFaqCategoryDTO.params
  ): Promise<Either<Error, string | null>> {
    await this.faqRepository.deleteCategoryById(request.id_category);
    return right("Categoria deletada com sucesso");
  }
}
