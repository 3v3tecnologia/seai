import { FaqRepositoryProtocol } from "../../_ports/repositories/faq-repository";
import { Either, left, right } from "../../../../shared/Either";
import { CreateFaqDTO, CreateFaqProtocol } from "./ports/create-faq";
import { QuestionAlreadyExistsError } from "./errors/question-exists";
import { Command } from "../../_ports/core/command";

export class CreateFaq extends Command implements CreateFaqProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    super();
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

    this.addLog({
      action: "create",
      table: "FAQ",
      description: `FAQ criado com sucesso`,
    });

    return right("Faq criado com sucesso");
  }
}
