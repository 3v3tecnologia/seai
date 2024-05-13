import { Either, left, right } from "../../../shared/Either";
import { Command } from "../_ports/core/command";
import { FaqRepositoryProtocol } from "../_ports/repositories/faq-repository";
import {
  DeleteFaqCategoryDTO,
  DeleteFaqCategoryProtocol,
} from "./protocols/delete-faq-category";

export class DeleteFaqCategory
  extends Command
  implements DeleteFaqCategoryProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    super();
    this.faqRepository = faqRepository;
  }
  async execute(
    request: DeleteFaqCategoryDTO.params
  ): Promise<Either<Error, string | null>> {
    this.resetLog();
    const isAssociatedWithFaq = await this.faqRepository.checkIfCategoryIsAlreadyAssociated(request.id_category)

    if (isAssociatedWithFaq) {
      return left(new Error("Não é possível apagar categorias associadas a algum FAQ"))
    }

    const exists = await this.faqRepository.getCategoryById(
      request.id_category
    );

    if (!exists) {
      return left(new Error("Categoria não existe"));
    }

    await this.faqRepository.deleteCategoryById(request.id_category);

    this.addLog({
      action: "delete",
      table: "FAQ_Category",
      description: `Categoria "${exists.title}" deletada com sucesso`,
    });

    return right("Categoria deletada com sucesso");
  }
}
