import { Either, left, right } from "../../../../shared/Either";
import { Category } from "../../../entities/faq/category";
import { Command } from "../../_ports/core/command";
import { FaqRepositoryProtocol } from "../../_ports/repositories/faq-repository";
import { CreateFaqCategoryDTO } from "./dto";
import { CreateFaqCategoryErrors } from "./errors";
import { CreateFaqCategoryProtocol } from "./protocol";

export class CreateFaqCategory
  extends Command
  implements CreateFaqCategoryProtocol
{
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    super();
    this.faqRepository = faqRepository;
  }

  async create(
    request: CreateFaqCategoryDTO.params
  ): Promise<Either<Error, CreateFaqCategoryDTO.result>> {
    this.resetLog();
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

    const alreadyExists = await this.faqRepository.loadCategoryByTitle(
      category.title as string
    );

    if (alreadyExists) {
      return left(new CreateFaqCategoryErrors.CategoryAlreadyExists());
    }

    await this.faqRepository.addCategory(
      category.title as string,
      category.description as string
    );

    this.addLog({
      action: "create",
      table: "Category",
      description: `Categoria ${request.title} criada com sucesso`,
    });

    return right("Categoria criada com sucesso");
  }
}
