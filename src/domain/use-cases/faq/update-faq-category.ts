import { UserCommandOperationProps } from "../../../modules/Logs/protocols/logger";
import { Either, left, right } from "../../../shared/Either";
import { Category } from "../../entities/faq/category";
import { FaqRepositoryProtocol } from "../_ports/repositories/faq-repository";
import { CreateFaqCategoryErrors } from "./errors/category-already-exists";
import { UpdateFaqCategoryErrors } from "./errors/update-faq-category-errors";
import { UpdateFaqCategoryProtocol } from "./protocols/update-faq-category";

export class UpdateFaqCategory implements UpdateFaqCategoryProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    this.faqRepository = faqRepository;
  }
  async execute(
    request: {
      id: number;
      title: string;
      description: string;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>> {
    const exists = await this.faqRepository.getCategoryById(
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

    const alreadyExists = await this.faqRepository.getCategoryByTitle(
      category.title as string
    );

    if (alreadyExists) {
      return left(new CreateFaqCategoryErrors.CategoryAlreadyExists());
    }

    await this.faqRepository.updateCategory(
      {
        id_category: category.id as number,
        title: category.title as string,
        description: category.description as string,
      },
      operation
    );

    return right("Categoria atualizada sucesso");
  }
}
