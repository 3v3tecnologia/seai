import { Either, left, right } from "../../../../shared/Either";
import { Command } from "../../_ports/core/command";
import { FaqRepositoryProtocol } from "../../_ports/repositories/faq-repository";
import { DeleteFaqDTO, DeleteFaqProtocol } from "./ports/delete-faq";

export class DeleteFaq extends Command implements DeleteFaqProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    super();
    this.faqRepository = faqRepository;
  }
  async delete(
    request: DeleteFaqDTO.params
  ): Promise<Either<Error, DeleteFaqDTO.result>> {
    this.resetLog();
    const exists = await this.faqRepository.loadById(request.id);

    if (!exists) {
      return left(new Error("Faq não encontrado"));
    }

    await this.faqRepository.deleteById(request.id);

    this.addLog({
      action: "delete",
      table: "FAQ",
      description: `FAQ "${
        exists.question.substring(0, 20) + "..."
      }" deletado com sucesso`,
    });

    return right("Faq deletado com sucesso");
  }
}
