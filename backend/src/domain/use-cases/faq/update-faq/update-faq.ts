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
    const exists = await this.faqRepository.loadById(request.id);

    if (!exists) {
      return left(new FaqNotExistsError());
    }

    const result = await this.faqRepository.update(request);

    return right(result);
  }
}
