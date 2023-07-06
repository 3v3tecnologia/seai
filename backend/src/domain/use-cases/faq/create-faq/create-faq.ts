import { FaqRepositoryProtocol } from "../../_data/repositories/faq-repository";
import { Either, left, right } from "../../../../shared/Either";
import { CreateFaqDTO, CreateFaqProtocol } from "./ports/create-faq";
import { QuestionAlreadyExistsError } from "./errors/question-exists";

export class CreateFaq implements CreateFaqProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    this.faqRepository = faqRepository;
  }
  async create(
    request: CreateFaqDTO.params
  ): Promise<Either<Error, CreateFaqDTO.result>> {
    const alreadyExists = await this.faqRepository.checkIfQuestionAlreadyExists(
      request.question
    );

    if (alreadyExists) {
      return left(new QuestionAlreadyExistsError());
    }

    await this.faqRepository.add(request);

    return right("Faq criado com sucesso");
  }
}
