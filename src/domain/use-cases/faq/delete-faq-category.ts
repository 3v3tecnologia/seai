import { UserCommandOperationProps } from "../../../modules/Logs/protocols/logger";
import { Either, left, right } from "../../../shared/Either";
import { FaqRepositoryProtocol } from "../_ports/repositories/faq-repository";
import { DeleteFaqCategoryProtocol } from "./protocols/delete-faq-category";

export class DeleteFaqCategory implements DeleteFaqCategoryProtocol {
  constructor(private readonly faqRepository: FaqRepositoryProtocol) {}
  async execute(
    id_category: number,
    operation: UserCommandOperationProps
  ): Promise<Either<Error, any>> {
    const isAssociatedWithFaq =
      await this.faqRepository.checkIfCategoryIsAlreadyAssociated(id_category);

    if (isAssociatedWithFaq) {
      return left(
        new Error("Não é possível apagar categorias associadas a algum FAQ")
      );
    }

    const exists = await this.faqRepository.getCategoryById(id_category);

    if (!exists) {
      return left(new Error("Categoria não existe"));
    }

    await this.faqRepository.deleteCategoryById(id_category, operation);

    return right("Categoria deletada com sucesso");
  }
}
