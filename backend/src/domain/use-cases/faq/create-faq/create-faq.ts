import { FaqRepository } from "../../../ports/db/faq/faq-repository";
import { Either, right } from "../../../../shared/Either";
import { CreateFaqDTO, CreateFaqProtocol } from "./ports/create-faq";

export class CreateFaq implements CreateFaqProtocol {
  private readonly faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.faqRepository = faqRepository;
  }
  async create(
    request: CreateFaqDTO.params
  ): Promise<Either<Error, CreateFaqDTO.result>> {
    // await this.faqRepository.add(request);
    return right("Faq criado com sucesso");
  }
}
