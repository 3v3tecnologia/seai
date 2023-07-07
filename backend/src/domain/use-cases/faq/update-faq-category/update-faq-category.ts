import { Either, left, right } from "../../../../shared/Either";
import { Command } from "../../_ports/core/command";
import { FaqRepositoryProtocol } from "../../_ports/repositories/faq-repository";
import {
  UpdateFaqCategoryDTO,
  UpdateFaqCategoryProtocol,
} from "./ports/update-faq-category";
import { UpdateFaqCategoryErrors } from "./update-faq-category-errors";

export class UpdateFaqCategory
  extends Command
  implements UpdateFaqCategoryProtocol
{
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    super();
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

    this.addLog({
      action: "update",
      table: "Category",
      description: `Categoria ${request.title} atualizada com sucesso`,
    });

    return right("Categoria atualizada sucesso");
  }
}
