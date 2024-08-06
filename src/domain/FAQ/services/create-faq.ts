import { Either, left, right } from "../../../shared/Either";
import { Category } from "../model/category";
import { Faq } from "../model/faq";
import { FaqRepositoryProtocol } from "../infra/repository/protocol/faq-repository";
import { QuestionAlreadyExistsError } from "./errors/question-exists";
import { CreateFaqDTO, CreateFaqProtocol } from "./protocols/create-faq";

export class CreateFaq implements CreateFaqProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    this.faqRepository = faqRepository;
  }
  async execute(
    request: CreateFaqDTO.params
  ): Promise<Either<Error, CreateFaqDTO.result>> {
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
        updated_at: category.updated_at,
      },
    });

    if (categoryProps.isLeft()) {
      return left(categoryProps.value);
    }

    const faqOrError = Faq.create({
      answer: request.answer,
      question: request.question,
      category: categoryProps.value as Category,
    });

    if (faqOrError.isLeft()) {
      return left(faqOrError.value);
    }

    const faq = faqOrError.value as Faq;

    const faqId = await this.faqRepository.addFaq(
      {
        answer: faq.answer.value,
        question: faq.question.value,
        category_id: faq.category.id as number,
      },
      request.accountId
    );

    if (faqId === null) {
      return left(new Error("Não foi possível completar registro do FAQ"));
    }

    return right(faqId);
  }
}
