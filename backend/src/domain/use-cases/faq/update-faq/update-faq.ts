import { FaqRepository } from "../../../ports/db/faq/faq-repository";
import { Either, right } from "../../../../shared/Either";

import { UpdateFaqDTO, UpdateFaqProtocol } from "./ports/update-faq";

export class UpdateFaqCategory implements UpdateFaqProtocol {
  private readonly faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.faqRepository = faqRepository;
  }
  async update(
    request: UpdateFaqDTO.params
  ): Promise<Either<Error, any | null>> {
    return right(1);
  }
}
