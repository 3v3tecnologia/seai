import { UserCommandOperationProps } from "../../../modules/UserOperations/protocols/logger";
import { Either, left, right } from "../../../shared/Either";
import { FaqRepositoryProtocol } from "../_ports/repositories/faq-repository";
import { DeleteFaqProtocol } from "./protocols/delete-faq";

export class DeleteFaq implements DeleteFaqProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    this.faqRepository = faqRepository;
  }
  async execute(
    id: number,
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>> {
    const exists = await this.faqRepository.getFaqById(id);

    if (!exists) {
      return left(new Error("Faq não encontrado"));
    }

    await this.faqRepository.deleteFaqById(id, operation);

    return right("Faq deletado com sucesso");
  }
}
