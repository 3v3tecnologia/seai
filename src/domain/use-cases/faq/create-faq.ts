import { Either, left, right } from "../../../shared/Either";
import { Category } from "../../entities/faq/category";
import { Faq } from "../../entities/faq/faq";
import { Command } from "../_ports/core/command";
import { FaqRepositoryProtocol } from "../_ports/repositories/faq-repository";
import { QuestionAlreadyExistsError } from "./errors/question-exists";
import { CreateFaqDTO, CreateFaqProtocol } from "./protocols/create-faq";

export class CreateFaq extends Command implements CreateFaqProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    super();
    this.faqRepository = faqRepository;
  }
  async execute(
    request: CreateFaqDTO.params
  ): Promise<Either<Error, CreateFaqDTO.result>> {
    this.resetLog();
    const alreadyExists = await this.faqRepository.checkIfQuestionAlreadyExists(
      request.question
    );

    if (alreadyExists) {
      return left(new QuestionAlreadyExistsError());
    }

    const category = await this.faqRepository.getCategoryById(
      request.id_category
    );

    if (category === null) {
      return left(new Error("Não foi possível localizar categoria"));
    }


    const categoryProps = Category.create({
      id: category.id,
      props: {
        title: category.title,
        description: category.description,
        created_at: category.created_at,
        updated_at: category.updated_at
      }
    });

    if (categoryProps.isLeft()) {
      return left(categoryProps.value)
    }

    const faqOrError = Faq.create({
      answer: request.answer,
      question: request.question,
      order: request.order,
      category: categoryProps.value as Category,
    });

    if (faqOrError.isLeft()) {
      return left(faqOrError.value);
    }

    const faq = faqOrError.value as Faq;

    const mappedToPersistence = {
      answer: faq.answer.value,
      question: faq.question.value,
      order: faq.order as number,
      category_id: faq.category.id as number,
    };

    const faqId = await this.faqRepository.addFaq(mappedToPersistence);

    if (faqId === null) {
      return left(new Error("Não foi possível completar registro do FAQ"));
    }

    this.addLog({
      action: "create",
      table: "FAQ",
      description: `FAQ criado com sucesso`,
    });

    return right(faqId);
  }
}
