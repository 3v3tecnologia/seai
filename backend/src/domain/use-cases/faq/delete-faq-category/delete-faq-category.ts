import { Either, left, right } from "../../../../shared/Either";
import { Command } from "../../_ports/core/command";
import { FaqRepositoryProtocol } from "../../_ports/repositories/faq-repository";
import {
  DeleteFaqCategoryDTO,
  DeleteFaqCategoryProtocol,
} from "./ports/delete-faq-category";

export class DeleteFaqCategory
  extends Command
  implements DeleteFaqCategoryProtocol
{
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    super();
    this.faqRepository = faqRepository;
  }
  async delete(
    request: DeleteFaqCategoryDTO.params
  ): Promise<Either<Error, string | null>> {
    const exists = await this.faqRepository.loadCategoryById(
      request.id_category
    );

    if (!exists) {
      return left(new Error("Categoria não existe"));
    }

    await this.faqRepository.deleteCategoryById(request.id_category);

    this.addLog({
      action: "delete",
      table: "FAQ_Category",
      description: `Categoria ${exists.title} deletada com sucesso`,
    });

    return right("Categoria deletada com sucesso");
  }
}
