import { Either, left, right } from "../../../../shared/Either";
import { FaqRepositoryProtocol } from "../../_data/repositories/faq-repository";

import { FaqNotExistsError } from "./errors/faq-not-exists";
import { UpdateFaqDTO, UpdateFaqProtocol } from "./ports/update-faq";

export class UpdateFaq implements UpdateFaqProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
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
