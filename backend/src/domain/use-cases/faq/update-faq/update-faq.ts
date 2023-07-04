import { FaqRepository } from "../../../ports/db/faq/faq-repository";
import { Either, left, right } from "../../../../shared/Either";

import { UpdateFaqDTO, UpdateFaqProtocol } from "./ports/update-faq";
import { FaqNotExistsError } from "./errors/faq-not-exists";

export class UpdateFaq implements UpdateFaqProtocol {
  private readonly faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
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

    return right("FAQ atualizado com sucesso");
  }
}
