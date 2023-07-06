import { Either, left, right } from "../../../../shared/Either";
import { FaqRepositoryProtocol } from "../../_ports/repositories/faq-repository";
import { CreateFaqCategoryDTO } from "./dto";
import { CreateFaqCategoryErrors } from "./errors";
import { CreateFaqCategoryProtocol } from "./protocol";

export class CreateFaqCategory implements CreateFaqCategoryProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
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

    // this.addLog({
    //   action: "create",
    //   table: "FAQ_Category",
    //   description: `Categoria ${request.title} criada com sucesso`,
    // });

    return right("Categoria criada com sucesso");
  }
}
