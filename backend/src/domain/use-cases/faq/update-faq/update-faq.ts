import { Either, left, right } from "../../../../shared/Either";
import { Command } from "../../_ports/core/command";
import { FaqRepositoryProtocol } from "../../_ports/repositories/faq-repository";

import { FaqNotExistsError } from "./errors/faq-not-exists";
import { UpdateFaqDTO, UpdateFaqProtocol } from "./ports/update-faq";

export class UpdateFaq extends Command implements UpdateFaqProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    super();
    this.faqRepository = faqRepository;
  }
  async update(
    request: UpdateFaqDTO.params
  ): Promise<Either<Error, UpdateFaqDTO.result>> {
    const exists = await this.faqRepository.checkIfFaqAlreadyExists(request.id);

    if (exists === false) {
      return left(new FaqNotExistsError());
    }

    await this.faqRepository.update(request);

    this.addLog({
      action: "update",
      table: "FAQ",
      description: `FAQ "${
        request.question.substring(0, 20) + "..."
      }" atualizado com sucesso`,
    });

    return right("FAQ atualizado com sucesso");
  }
}
