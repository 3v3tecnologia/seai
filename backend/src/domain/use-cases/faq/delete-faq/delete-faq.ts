import { Either, left, right } from "../../../../shared/Either";
import { FaqRepository } from "../../../ports/db/faq/faq-repository";
import { DeleteFaqDTO, DeleteFaqProtocol } from "./ports/delete-faq";

export class DeleteFaq implements DeleteFaqProtocol {
  private readonly faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.faqRepository = faqRepository;
  }
  async delete(
    request: DeleteFaqDTO.params
  ): Promise<Either<Error, DeleteFaqDTO.result>> {
    const exists = await this.faqRepository.loadById(request.id);

    if (!exists) {
      return left(new Error("Faq não encontrado"));
    }

    await this.faqRepository.deleteById(request.id);

    return right("Faq deletado com sucesso");
  }
}
