import { Either, left, right } from "../../../shared/Either";
import { FaqRepositoryProtocol } from "../infra/repository/protocol/faq-repository";
import { Category } from "../model/category";
import { CreateFaqCategoryErrors } from "./errors/category-already-exists";
import { CreateFaqCategoryProtocol } from "./protocols/create-category";

export class CreateFaqCategory implements CreateFaqCategoryProtocol {
  constructor(private readonly faqRepository: FaqRepositoryProtocol) {}

  async create(
    request: {
      title: string;
      description: string;
    },
    accountId: number
  ): Promise<Either<Error, number>> {
    const categoryOrError = Category.create({
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

    const id = await this.faqRepository.addCategory(
      category.title as string,
      category.description as string,
      accountId
    );

    return right(id);
  }
}
