import { Either, left, right } from "../../../../shared/Either";
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
    const alreadyExists = await this.faqRepository.loadCategoryByTitle(
      request.title
    );

    if (alreadyExists) {
      return left(new CreateFaqCategoryErrors.CategoryAlreadyExists());
    }

    await this.faqRepository.addCategory(request.title, request.description);

    this.addLog({
      action: "create",
      table: "Category",
      description: `Categoria ${request.title} criada com sucesso`,
    });

    return right("Categoria criada com sucesso");
  }
}
