import { Either, left, right } from "../../../../shared/Either";
import { Category } from "../../../entities/faq/category";
import { Command } from "../../_ports/core/command";
import { FaqRepositoryProtocol } from "../../_ports/repositories/faq-repository";
import { CreateFaqCategoryErrors } from "../create-category/errors";
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
    this.resetLog();
    const exists = await this.faqRepository.loadCategoryById(
      request.id as number
    );

    if (!exists) {
      return left(new UpdateFaqCategoryErrors.CategoryNotExists());
    }

    const categoryOrError = Category.create({
      id: request.id,
      props: {
        title: request.title,
        description: request.description,
      },
    });

    if (categoryOrError.isLeft()) {
      return left(categoryOrError.value);
    }

    const category = categoryOrError.value as Category;

    const alreadyExists = await this.faqRepository.loadCategoryByTitle(
      category.title as string
    );

    if (alreadyExists) {
      return left(new CreateFaqCategoryErrors.CategoryAlreadyExists());
    }

    await this.faqRepository.updateCategory(
      category.id as number,
      category.title as string,
      category.description as string
    );

    this.addLog({
      action: "update",
      table: "Category",
      description: `Categoria ${category.title} atualizada com sucesso`,
    });

    return right("Categoria atualizada sucesso");
  }
}
